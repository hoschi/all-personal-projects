import {
  ErrorComponent,
  createFileRoute,
  type ErrorComponentProps,
} from "@tanstack/react-router"
import { Pause, Play, Square } from "lucide-react"
import { ArrowDown, Bug, Pencil, Plus, Save, Scissors, X } from "lucide-react"
import RecordRTC from "recordrtc"
import { useEffect, useEffectEvent, useRef, useState } from "react"

import type {
  ImproveTextResult,
  TabFieldConflict,
  TabListItem,
  TabSnapshot,
  TabSyncField,
  TabWriteResult,
} from "@/contracts/tab-sync"
import {
  createTabFn,
  deleteTabFn,
  listTabsFn,
  overwriteClientFn,
  overwriteServerFn,
  renameTabFn,
  selectTabFn,
  updateTabFieldFn,
} from "@/data/tab-sync-actions"
import { improveTabRecordingFn } from "@/data/text-improvement-actions"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CLIENT_ID_STORAGE_KEY = "sst-client-id" as const
const ACTIVE_TAB_STORAGE_PREFIX = "sst-active-tab-id" as const
const DEFAULT_IMPROVE_LANGUAGE = "de" as const
const TOP_TEXT_AUTOSAVE_THROTTLE_MS = 1_000 as const
const BOTTOM_TEXT_AUTOSAVE_THROTTLE_MS = 1_000 as const

type RecordingStatus = "idle" | "recording"

type TabLocalRecording = {
  audioBlob: Blob
  objectUrl: string
  sizeLabel: string
}

function bytesToSize(bytes: number) {
  if (bytes === 0) {
    return "0 Bytes"
  }

  const BASE = 1_000
  const SIZE_UNITS = ["Bytes", "KB", "MB", "GB", "TB"] as const
  const sizeIndex = Math.floor(Math.log(bytes) / Math.log(BASE))
  const normalizedBytes = bytes / BASE ** sizeIndex
  return `${normalizedBytes.toPrecision(3)} ${SIZE_UNITS[sizeIndex]}`
}

function createFallbackClientId() {
  return `sst-client-${Math.random().toString(36).slice(2)}`
}

function getActiveTabStorageKey(clientId: string) {
  return `${ACTIVE_TAB_STORAGE_PREFIX}:${clientId}`
}

function readPersistedActiveTabId(clientId: string) {
  return window.localStorage.getItem(getActiveTabStorageKey(clientId))
}

function persistActiveTabId(clientId: string, tabId: string) {
  const storageKey = getActiveTabStorageKey(clientId)

  if (tabId.length === 0) {
    window.localStorage.removeItem(storageKey)
    return
  }

  window.localStorage.setItem(storageKey, tabId)
}

function getOrCreateClientId() {
  const existingClientId = window.localStorage.getItem(CLIENT_ID_STORAGE_KEY)

  if (existingClientId) {
    return existingClientId
  }

  const nextClientId = window.crypto?.randomUUID?.() ?? createFallbackClientId()
  window.localStorage.setItem(CLIENT_ID_STORAGE_KEY, nextClientId)
  return nextClientId
}

function toRuntimeError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error
  }

  return new Error(fallbackMessage, { cause: error })
}

function IndexRouteErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />
}

function toTabListItem(tab: TabSnapshot): TabListItem {
  return {
    id: tab.id,
    title: tab.title,
    titleVersion: tab.titleVersion,
    titleUpdatedAt: tab.titleUpdatedAt,
    updatedAt: tab.updatedAt,
  }
}

function mergeTabListItem(items: ReadonlyArray<TabListItem>, tab: TabSnapshot) {
  const nextItem = toTabListItem(tab)
  const index = items.findIndex((item) => item.id === tab.id)

  if (index === -1) {
    return [...items, nextItem]
  }

  return items.map((item) => (item.id === tab.id ? nextItem : item))
}

type WordDiffSegment = {
  kind: "same" | "added" | "removed"
  text: string
}

function toWords(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)
}

function buildWordDiffSegments(rawText: string, correctedText: string) {
  const sourceWords = toWords(rawText)
  const targetWords = toWords(correctedText)
  const sourceLength = sourceWords.length
  const targetLength = targetWords.length
  const lcsTable = Array.from({ length: sourceLength + 1 }, () =>
    Array<number>(targetLength + 1).fill(0),
  )

  for (let sourceIndex = 1; sourceIndex <= sourceLength; sourceIndex += 1) {
    for (let targetIndex = 1; targetIndex <= targetLength; targetIndex += 1) {
      if (sourceWords[sourceIndex - 1] === targetWords[targetIndex - 1]) {
        lcsTable[sourceIndex][targetIndex] =
          (lcsTable[sourceIndex - 1]?.[targetIndex - 1] ?? 0) + 1
      } else {
        lcsTable[sourceIndex][targetIndex] = Math.max(
          lcsTable[sourceIndex - 1]?.[targetIndex] ?? 0,
          lcsTable[sourceIndex]?.[targetIndex - 1] ?? 0,
        )
      }
    }
  }

  const operations: Array<WordDiffSegment> = []
  let sourceIndex = sourceLength
  let targetIndex = targetLength

  while (sourceIndex > 0 && targetIndex > 0) {
    const sourceWord = sourceWords[sourceIndex - 1]
    const targetWord = targetWords[targetIndex - 1]

    if (sourceWord === targetWord) {
      operations.push({ kind: "same", text: sourceWord })
      sourceIndex -= 1
      targetIndex -= 1
      continue
    }

    const sourceLcs = lcsTable[sourceIndex - 1]?.[targetIndex] ?? 0
    const targetLcs = lcsTable[sourceIndex]?.[targetIndex - 1] ?? 0

    if (sourceLcs >= targetLcs) {
      operations.push({ kind: "removed", text: sourceWord ?? "" })
      sourceIndex -= 1
      continue
    }

    operations.push({ kind: "added", text: targetWord ?? "" })
    targetIndex -= 1
  }

  while (sourceIndex > 0) {
    operations.push({
      kind: "removed",
      text: sourceWords[sourceIndex - 1] ?? "",
    })
    sourceIndex -= 1
  }

  while (targetIndex > 0) {
    operations.push({ kind: "added", text: targetWords[targetIndex - 1] ?? "" })
    targetIndex -= 1
  }

  operations.reverse()

  return operations.reduce<Array<WordDiffSegment>>((segments, operation) => {
    if (operation.text.length === 0) {
      return segments
    }

    const previousSegment = segments[segments.length - 1]

    if (previousSegment?.kind === operation.kind) {
      previousSegment.text = `${previousSegment.text} ${operation.text}`
      return segments
    }

    return [...segments, { ...operation }]
  }, [])
}

export const Route = createFileRoute("/")({
  ssr: false,
  loader: async () => {
    const tabs = await listTabsFn()

    if (tabs.length > 0) {
      return {
        initialTabs: tabs,
        initialActiveTabId: tabs[0].id,
      }
    }

    const createdTab = await createTabFn({ data: {} })

    return {
      initialTabs: [toTabListItem(createdTab)],
      initialActiveTabId: createdTab.id,
    }
  },
  errorComponent: IndexRouteErrorComponent,
  component: RouteComponent,
})

function RouteComponent() {
  const { initialTabs, initialActiveTabId } = Route.useLoaderData()

  const mediaRecorderRef = useRef<RecordRTC | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const tabRecordingsRef = useRef<Record<string, TabLocalRecording>>({})
  const autoSaveInFlightRef = useRef({
    topText: false,
    bottomText: false,
  })

  const [clientId] = useState(() => getOrCreateClientId())
  const [tabs, setTabs] = useState(initialTabs)
  const [activeTabId, setActiveTabId] = useState(() => {
    const persistedActiveTabId = readPersistedActiveTabId(clientId)

    if (
      persistedActiveTabId &&
      initialTabs.some((tab) => tab.id === persistedActiveTabId)
    ) {
      return persistedActiveTabId
    }

    return initialActiveTabId
  })
  const [activeTab, setActiveTab] = useState<TabSnapshot | null>(null)
  const [titleDraft, setTitleDraft] = useState("")
  const [topTextDraft, setTopTextDraft] = useState("")
  const [bottomTextDraft, setBottomTextDraft] = useState("")
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [conflict, setConflict] = useState<TabFieldConflict | null>(null)
  const [recordingStatus, setRecordingStatus] =
    useState<RecordingStatus>("idle")
  const [recordingTabId, setRecordingTabId] = useState<string | null>(null)
  const [playingTabId, setPlayingTabId] = useState<string | null>(null)
  const [isPlaybackPaused, setIsPlaybackPaused] = useState(false)
  const [tabRecordings, setTabRecordings] = useState<
    Record<string, TabLocalRecording>
  >({})
  const [tabImproveResults, setTabImproveResults] = useState<
    Record<string, ImproveTextResult>
  >({})
  const [isDebugPanelOpen, setIsDebugPanelOpen] = useState(false)
  const [isTabTitleEditMode, setIsTabTitleEditMode] = useState(false)
  const [runtimeError, setRuntimeError] = useState<Error | null>(null)
  const [autoSaveState, setAutoSaveState] = useState({
    topText: false,
    bottomText: false,
  })

  if (runtimeError) {
    throw runtimeError
  }

  const activeTabRecording = activeTab
    ? (tabRecordings[activeTab.id] ?? null)
    : null
  const activeTabImproveResult = activeTab
    ? (tabImproveResults[activeTab.id] ?? null)
    : null
  const hasActiveTabRecording =
    activeTabRecording !== null && activeTabRecording.audioBlob.size > 0
  const isRecordingInProgress =
    recordingStatus === "recording" || recordingTabId !== null
  const isProcessingRecording = pendingAction === "process-recording"
  const canReplayRecording = hasActiveTabRecording && !isRecordingInProgress
  const canDebugImproveResult = activeTabImproveResult !== null
  const isActiveTabReplayRunning =
    activeTab !== null && playingTabId === activeTab.id && !isPlaybackPaused
  const isActiveTabReplayPaused =
    activeTab !== null && playingTabId === activeTab.id && isPlaybackPaused
  const recordButtonLabel =
    recordingStatus === "recording"
      ? "recording"
      : isProcessingRecording
        ? "loading"
        : "start"
  const debugDiffSegments =
    activeTabImproveResult === null
      ? []
      : buildWordDiffSegments(
          activeTabImproveResult.rawTranscriptionText,
          activeTabImproveResult.correctedText,
        )

  const canSaveTitle =
    activeTab !== null &&
    titleDraft.trim().length > 0 &&
    titleDraft.trim() !== activeTab.title &&
    conflict === null
  const canPutText =
    activeTab !== null &&
    topTextDraft.length > 0 &&
    pendingAction === null &&
    conflict === null
  const isStartBlockedByTopText =
    recordingStatus !== "recording" && topTextDraft.trim().length > 0
  const isConflictActive = conflict !== null
  const isTopTextDirty =
    activeTab !== null && topTextDraft !== activeTab.topText
  const isBottomTextDirty =
    activeTab !== null && bottomTextDraft !== activeTab.bottomText

  function applyActiveTab(nextTab: TabSnapshot) {
    setActiveTab(nextTab)
    setTitleDraft(nextTab.title)
    setTopTextDraft(nextTab.topText)
    setBottomTextDraft(nextTab.bottomText)
    setTabs((currentTabs) => mergeTabListItem(currentTabs, nextTab))
  }

  function updateServerTabSnapshot(nextTab: TabSnapshot) {
    setActiveTab(nextTab)
    setTabs((currentTabs) => mergeTabListItem(currentTabs, nextTab))
  }

  function stopActiveMediaStream() {
    const stream = mediaStreamRef.current

    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
    }
  }

  function setAutoSaveFieldState(
    field: "topText" | "bottomText",
    isSaving: boolean,
  ) {
    setAutoSaveState((currentState) => ({
      ...currentState,
      [field]: isSaving,
    }))
  }

  function handlePutText() {
    if (!activeTab || topTextDraft.length === 0 || pendingAction !== null) {
      return
    }

    const normalizedTopText = topTextDraft.trimStart()

    setBottomTextDraft((currentBottomText) => {
      if (currentBottomText === "") {
        return normalizedTopText
      }

      if (/\s$/.test(currentBottomText)) {
        return `${currentBottomText}${normalizedTopText}`
      }

      return `${currentBottomText} ${normalizedTopText}`
    })
    setTopTextDraft("")
    setConflict((currentConflict) => {
      if (
        currentConflict &&
        (currentConflict.field === "topText" ||
          currentConflict.field === "bottomText")
      ) {
        return null
      }

      return currentConflict
    })
    setStatusMessage("Moved top text into bottom textbox.")
  }

  function removeTabFromLocalState(tabIdToDelete: string) {
    const remainingTabs = tabs.filter((tab) => tab.id !== tabIdToDelete)

    removeTabRecording(tabIdToDelete)
    removeTabImproveResult(tabIdToDelete)
    setTabs(remainingTabs)
    setConflict(null)

    if (remainingTabs.length > 0) {
      setActiveTabId(remainingTabs[0].id)
      return
    }

    setActiveTabId("")
    setActiveTab(null)
    setTitleDraft("")
    setTopTextDraft("")
    setBottomTextDraft("")
  }

  async function handleCutBottomTextAndDeleteTab() {
    if (!activeTab) {
      return
    }

    const tabIdToDelete = activeTab.id
    const textToCopy = bottomTextDraft

    setPendingAction("cut-bottom-text-and-delete-tab")
    setStatusMessage(null)

    try {
      await navigator.clipboard.writeText(textToCopy)
      const deleteResult = await deleteTabFn({
        data: {
          tabId: tabIdToDelete,
        },
      })

      removeTabFromLocalState(tabIdToDelete)

      if (deleteResult.status === "not_found") {
        setStatusMessage("Tab no longer exists on the server.")
      } else {
        setStatusMessage("Bottom text copied to clipboard. Tab deleted.")
      }
    } catch (error) {
      setRuntimeError(
        toRuntimeError(error, "Failed to copy bottom text and delete tab."),
      )
    } finally {
      setPendingAction(null)
    }
  }

  async function handleDeleteActiveTab() {
    if (!activeTab) {
      return
    }

    if (!window.confirm("Delete the active tab?")) {
      return
    }

    const tabIdToDelete = activeTab.id

    setPendingAction("delete-active-tab")
    setStatusMessage(null)

    try {
      const deleteResult = await deleteTabFn({
        data: {
          tabId: tabIdToDelete,
        },
      })

      removeTabFromLocalState(tabIdToDelete)

      if (deleteResult.status === "not_found") {
        setStatusMessage("Tab no longer exists on the server.")
      } else {
        setStatusMessage("Active tab deleted.")
      }
    } catch (error) {
      setRuntimeError(toRuntimeError(error, "Failed to delete the active tab."))
    } finally {
      setPendingAction(null)
    }
  }

  function stopActivePlayback() {
    const audioPlayer = audioPlayerRef.current

    if (audioPlayer) {
      audioPlayer.pause()
      audioPlayer.currentTime = 0
      audioPlayerRef.current = null
    }

    setPlayingTabId(null)
    setIsPlaybackPaused(false)
  }

  function removeTabRecording(tabId: string) {
    setTabRecordings((currentRecordings) => {
      const recordingToRemove = currentRecordings[tabId]

      if (!recordingToRemove) {
        return currentRecordings
      }

      URL.revokeObjectURL(recordingToRemove.objectUrl)
      const nextRecordings = { ...currentRecordings }
      delete nextRecordings[tabId]
      return nextRecordings
    })
  }

  function removeTabImproveResult(tabId: string) {
    setTabImproveResults((currentImproveResults) => {
      if (!(tabId in currentImproveResults)) {
        return currentImproveResults
      }

      const nextImproveResults = { ...currentImproveResults }
      delete nextImproveResults[tabId]
      return nextImproveResults
    })
  }

  function storeTabRecording(tabId: string, audioBlob: Blob) {
    setTabRecordings((currentRecordings) => {
      const existingRecording = currentRecordings[tabId]

      if (existingRecording) {
        URL.revokeObjectURL(existingRecording.objectUrl)
      }

      return {
        ...currentRecordings,
        [tabId]: {
          audioBlob,
          objectUrl: URL.createObjectURL(audioBlob),
          sizeLabel: bytesToSize(audioBlob.size),
        },
      }
    })
  }

  async function startRecordingForActiveTab() {
    if (!activeTab) {
      return
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Audio recording is not supported in this browser.")
    }

    stopActivePlayback()
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    })
    const mediaRecorder = new RecordRTC(mediaStream, {
      type: "audio",
      mimeType: "audio/wav",
      recorderType: RecordRTC.StereoAudioRecorder,
    })

    mediaStreamRef.current = mediaStream
    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.startRecording()
    setRecordingTabId(activeTab.id)
    setRecordingStatus("recording")
    setStatusMessage("Recording started.")
  }

  async function stopRecording() {
    const mediaRecorder = mediaRecorderRef.current

    if (!mediaRecorder || mediaRecorder.state === "stopped") {
      throw new Error("Recording is not active.")
    }

    const targetTabId = recordingTabId ?? activeTab?.id

    if (!targetTabId) {
      throw new Error("No tab is available to store the recording.")
    }

    const audioBlob = await new Promise<Blob>((resolve, reject) => {
      mediaRecorder.stopRecording(() => {
        const nextAudioBlob = mediaRecorder.getBlob()

        if (!nextAudioBlob || nextAudioBlob.size === 0) {
          reject(new Error("Recorded audio blob is empty."))
          return
        }

        resolve(nextAudioBlob)
      })
    })

    stopActiveMediaStream()
    mediaRecorderRef.current = null
    setRecordingStatus("idle")
    setRecordingTabId(null)
    storeTabRecording(targetTabId, audioBlob)

    return {
      tabId: targetTabId,
      audioBlob,
      sizeLabel: bytesToSize(audioBlob.size),
    }
  }

  async function handleImproveFromRecording(input: {
    tabId: string
    audioBlob: Blob
    sizeLabel: string
  }) {
    if (!activeTab || activeTab.id !== input.tabId) {
      return
    }

    const tabSnapshot = activeTab

    setPendingAction("process-recording")
    setStatusMessage("Recording captured. Processing speech-to-text...")

    try {
      const formData = new FormData()
      formData.append("file", input.audioBlob, "audio.wav")
      formData.append("tabId", tabSnapshot.id)
      formData.append("contextText", bottomTextDraft)
      formData.append("language", DEFAULT_IMPROVE_LANGUAGE)

      const improveResult = await improveTabRecordingFn({
        data: formData,
      })

      setTabImproveResults((currentImproveResults) => ({
        ...currentImproveResults,
        [tabSnapshot.id]: improveResult,
      }))

      setTopTextDraft(improveResult.correctedText)

      const writeResult = await updateTabFieldFn({
        data: {
          tabId: tabSnapshot.id,
          field: "topText",
          value: improveResult.correctedText,
          expectedVersion: tabSnapshot.topTextVersion,
          clientId,
        },
      })

      const wasSaved = updateFromWriteResult(writeResult, "topText", {
        showSavedMessage: false,
      })

      if (wasSaved) {
        setStatusMessage(
          `Saved recording (${input.sizeLabel}) and processed text (${improveResult.totalDurationMs} ms).`,
        )
      }
    } catch (error) {
      setRuntimeError(toRuntimeError(error, "Failed to process recording."))
    } finally {
      setPendingAction(null)
    }
  }

  async function handleRecordButton() {
    if (!activeTab) {
      setStatusMessage("Create or select a tab before recording.")
      return
    }

    setStatusMessage(null)

    try {
      if (recordingStatus === "recording") {
        const finishedRecording = await stopRecording()
        await handleImproveFromRecording(finishedRecording)
        return
      }

      await startRecordingForActiveTab()
    } catch (error) {
      stopActiveMediaStream()
      mediaRecorderRef.current = null
      setRecordingStatus("idle")
      setRecordingTabId(null)
      setRuntimeError(
        toRuntimeError(error, "Failed to handle audio recording."),
      )
    }
  }

  async function handlePlayButton() {
    if (!activeTab || !activeTabRecording) {
      return
    }

    setStatusMessage(null)

    try {
      if (playingTabId === activeTab.id) {
        const activeAudioPlayer = audioPlayerRef.current

        if (!activeAudioPlayer || !activeAudioPlayer.paused) {
          return
        }

        await activeAudioPlayer.play()
        setIsPlaybackPaused(false)
        return
      }

      stopActivePlayback()
      const audioPlayer = new Audio(activeTabRecording.objectUrl)

      audioPlayerRef.current = audioPlayer
      setPlayingTabId(activeTab.id)
      setIsPlaybackPaused(false)
      audioPlayer.onended = () => {
        setPlayingTabId((currentPlayingTabId) =>
          currentPlayingTabId === activeTab.id ? null : currentPlayingTabId,
        )
        setIsPlaybackPaused(false)
        audioPlayerRef.current = null
      }

      await audioPlayer.play()
    } catch (error) {
      stopActivePlayback()
      setRuntimeError(toRuntimeError(error, "Failed to replay recording."))
    }
  }

  function handlePauseButton() {
    if (!activeTab || playingTabId !== activeTab.id) {
      return
    }

    const activeAudioPlayer = audioPlayerRef.current

    if (!activeAudioPlayer || activeAudioPlayer.paused) {
      return
    }

    activeAudioPlayer.pause()
    setIsPlaybackPaused(true)
  }

  function updateFromWriteResult(
    result: TabWriteResult,
    field: TabSyncField,
    options?: {
      showSavedMessage?: boolean
    },
  ): boolean {
    const showSavedMessage = options?.showSavedMessage ?? true

    if (result.status === "updated") {
      updateServerTabSnapshot(result.tab)

      if (field === "title") {
        setTitleDraft(result.tab.title)
      }
      setConflict((currentConflict) => {
        if (!currentConflict) {
          return null
        }

        if (currentConflict.field === field) {
          return null
        }

        return currentConflict
      })

      if (showSavedMessage) {
        setStatusMessage(`${field} was saved.`)
      }

      return true
    }

    if (result.status === "conflict") {
      updateServerTabSnapshot(result.tab)
      setConflict(result.conflict)
      setStatusMessage(
        `Conflict detected for ${field}. Choose "Use Server Data" or "Write Client to Server".`,
      )
      return false
    }

    setStatusMessage("This tab no longer exists on the server.")
    setConflict(null)
    setActiveTab(null)
    const remainingTabs = tabs.filter((tab) => tab.id !== result.tabId)
    removeTabRecording(result.tabId)
    removeTabImproveResult(result.tabId)
    setTabs(remainingTabs)

    if (remainingTabs.length > 0) {
      setActiveTabId(remainingTabs[0].id)
    } else {
      setActiveTabId("")
    }

    return false
  }

  function readDraftForField(field: TabSyncField) {
    if (field === "title") {
      return titleDraft.trim()
    }

    if (field === "topText") {
      return topTextDraft
    }

    return bottomTextDraft
  }

  async function loadActiveTab(tabId: string) {
    setPendingAction("select-tab")
    setStatusMessage(null)

    try {
      const selectedTab = await selectTabFn({
        data: {
          tabId,
          clientId,
        },
      })

      if (!selectedTab) {
        setStatusMessage("The selected tab could not be loaded.")
        setActiveTab(null)
        const remainingTabs = tabs.filter((tab) => tab.id !== tabId)
        removeTabRecording(tabId)
        removeTabImproveResult(tabId)
        setTabs(remainingTabs)

        if (remainingTabs.length > 0) {
          setActiveTabId(remainingTabs[0].id)
        } else {
          setActiveTabId("")
        }

        return
      }

      applyActiveTab(selectedTab)
      setConflict(null)
    } catch (error) {
      setRuntimeError(toRuntimeError(error, "Failed to load selected tab."))
    } finally {
      setPendingAction(null)
    }
  }

  async function handleCreateTab() {
    setPendingAction("create-tab")
    setStatusMessage(null)

    try {
      const createdTab = await createTabFn({ data: {} })
      setTabs((currentTabs) => [...currentTabs, toTabListItem(createdTab)])
      setActiveTabId(createdTab.id)
      applyActiveTab(createdTab)
      setConflict(null)
      setStatusMessage("Created a new tab.")
    } catch (error) {
      setRuntimeError(toRuntimeError(error, "Failed to create a new tab."))
    } finally {
      setPendingAction(null)
    }
  }

  async function handleSaveTitle() {
    if (!activeTab) {
      return
    }

    const nextTitle = titleDraft.trim()

    if (nextTitle.length === 0) {
      return
    }

    setPendingAction("save-title")
    setStatusMessage(null)

    try {
      const result = await renameTabFn({
        data: {
          tabId: activeTab.id,
          title: nextTitle,
          expectedVersion: activeTab.titleVersion,
          clientId,
        },
      })

      updateFromWriteResult(result, "title")
    } catch (error) {
      setRuntimeError(toRuntimeError(error, "Failed to save title."))
    } finally {
      setPendingAction(null)
    }
  }

  async function handleSaveTitleAndCloseEditor() {
    if (!activeTab) {
      return
    }

    if (canSaveTitle) {
      await handleSaveTitle()
    }

    setIsTabTitleEditMode(false)
  }

  async function handleAutoSaveTextField(field: "topText" | "bottomText") {
    if (!activeTab) {
      return
    }

    if (pendingAction !== null || conflict !== null) {
      return
    }

    const expectedVersion =
      field === "topText"
        ? activeTab.topTextVersion
        : activeTab.bottomTextVersion
    const value = field === "topText" ? topTextDraft : bottomTextDraft

    if (autoSaveInFlightRef.current[field]) {
      return
    }

    const serverValue =
      field === "topText" ? activeTab.topText : activeTab.bottomText

    if (value === serverValue) {
      return
    }

    autoSaveInFlightRef.current[field] = true
    setAutoSaveFieldState(field, true)

    try {
      const result = await updateTabFieldFn({
        data: {
          tabId: activeTab.id,
          field,
          value,
          expectedVersion,
          clientId,
        },
      })

      updateFromWriteResult(result, field, {
        showSavedMessage: false,
      })
    } catch (error) {
      setRuntimeError(toRuntimeError(error, `Failed to auto-save ${field}.`))
    } finally {
      autoSaveInFlightRef.current[field] = false
      setAutoSaveFieldState(field, false)
    }
  }

  const runThrottledTopTextAutoSave = useEffectEvent(() => {
    void handleAutoSaveTextField("topText")
  })

  const runThrottledBottomTextAutoSave = useEffectEvent(() => {
    void handleAutoSaveTextField("bottomText")
  })

  async function handleOverwriteServer() {
    if (!activeTab || !conflict) {
      return
    }

    setPendingAction("overwrite-server")
    setStatusMessage(null)

    try {
      const result = await overwriteServerFn({
        data: {
          tabId: activeTab.id,
          field: conflict.field,
          clientId,
        },
      })

      if (result.status === "updated") {
        applyActiveTab(result.tab)
        setConflict(null)
        setStatusMessage("Server data loaded into client.")
      } else if (result.status === "not_found") {
        setStatusMessage("Tab no longer exists on the server.")
      }
    } catch (error) {
      setRuntimeError(toRuntimeError(error, "Failed to apply Use Server Data."))
    } finally {
      setPendingAction(null)
    }
  }

  async function handleOverwriteClient() {
    if (!activeTab || !conflict) {
      return
    }

    setPendingAction("overwrite-client")
    setStatusMessage(null)

    try {
      const result = await overwriteClientFn({
        data: {
          tabId: activeTab.id,
          field: conflict.field,
          value: readDraftForField(conflict.field),
          clientId,
        },
      })

      if (result.status === "updated") {
        applyActiveTab(result.tab)
        setConflict(null)
        setStatusMessage("Client draft written to server.")
      } else if (result.status === "not_found") {
        setStatusMessage("Tab no longer exists on the server.")
      }
    } catch (error) {
      setRuntimeError(
        toRuntimeError(error, "Failed to apply Write Client to Server."),
      )
    } finally {
      setPendingAction(null)
    }
  }

  useEffect(() => {
    tabRecordingsRef.current = tabRecordings
  }, [tabRecordings])

  useEffect(() => {
    persistActiveTabId(clientId, activeTabId)
  }, [activeTabId, clientId])

  useEffect(() => {
    if (playingTabId && playingTabId !== activeTabId) {
      stopActivePlayback()
    }
  }, [activeTabId, playingTabId])

  useEffect(() => {
    if (!activeTabId) {
      setActiveTab(null)
      return
    }

    void loadActiveTab(activeTabId)
  }, [activeTabId])

  useEffect(() => {
    if (!activeTab) {
      return
    }

    if (pendingAction !== null || conflict !== null) {
      return
    }

    if (topTextDraft === activeTab.topText) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      runThrottledTopTextAutoSave()
    }, TOP_TEXT_AUTOSAVE_THROTTLE_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [activeTab, topTextDraft, pendingAction, conflict?.field])

  useEffect(() => {
    if (!activeTab) {
      return
    }

    if (pendingAction !== null || conflict !== null) {
      return
    }

    if (bottomTextDraft === activeTab.bottomText) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      runThrottledBottomTextAutoSave()
    }, BOTTOM_TEXT_AUTOSAVE_THROTTLE_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [activeTab, bottomTextDraft, pendingAction, conflict?.field])

  useEffect(() => {
    return () => {
      const mediaRecorder = mediaRecorderRef.current

      if (mediaRecorder && mediaRecorder.state !== "stopped") {
        mediaRecorder.stopRecording(() => {
          mediaRecorderRef.current = null
        })
      }

      stopActiveMediaStream()
      stopActivePlayback()
      Object.values(tabRecordingsRef.current).forEach((recording) => {
        URL.revokeObjectURL(recording.objectUrl)
      })
    }
  }, [])

  return (
    <main className="space-y-2">
      <header className="text-center shadow-xs">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          Speech-To-Structured-Text Workspace
        </h1>
      </header>

      <section
        className={[
          "rounded-xl p-2",
          conflict
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-border bg-card",
        ].join(" ")}
      >
        <div>
          <div className="flex flex-wrap items-start gap-2">
            {isTabTitleEditMode ? (
              <div className="flex min-w-0 flex-1 gap-2">
                <input
                  id="tab-title-input"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                  value={titleDraft}
                  onChange={(event) => {
                    setTitleDraft(event.currentTarget.value)
                  }}
                  disabled={
                    activeTab === null ||
                    pendingAction !== null ||
                    conflict !== null
                  }
                />
                <button
                  type="button"
                  onClick={() => {
                    void handleSaveTitleAndCloseEditor()
                  }}
                  disabled={
                    activeTab === null ||
                    pendingAction !== null ||
                    isConflictActive
                  }
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Save tab title"
                >
                  <Save className="size-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <Tabs
                value={activeTabId}
                onValueChange={(nextTabId) => {
                  setStatusMessage(null)
                  setConflict(null)
                  setActiveTabId(nextTabId)
                  setIsTabTitleEditMode(false)
                }}
                className="min-w-0 flex-1"
              >
                <TabsList className="h-auto w-full max-w-full flex-wrap justify-start">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      disabled={
                        recordingStatus === "recording" || isConflictActive
                      }
                      className="flex-none"
                    >
                      {tab.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}

            {isTabTitleEditMode ? null : (
              <>
                <button
                  type="button"
                  onClick={handleCreateTab}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={
                    pendingAction !== null ||
                    recordingStatus === "recording" ||
                    isConflictActive
                  }
                  aria-label="Create new tab"
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void handleDeleteActiveTab()
                  }}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={
                    activeTab === null ||
                    pendingAction !== null ||
                    recordingStatus === "recording" ||
                    isConflictActive
                  }
                  aria-label="Delete active tab"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsTabTitleEditMode(true)
                  }}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={
                    activeTab === null ||
                    pendingAction !== null ||
                    recordingStatus === "recording" ||
                    isConflictActive
                  }
                  aria-label="Edit active tab title"
                >
                  <Pencil className="size-4" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          <textarea
            id="top-textarea"
            className="min-h-56 rounded-md border border-input bg-background px-3 py-2 text-[15px] outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            value={topTextDraft}
            onChange={(event) => {
              setTopTextDraft(event.currentTarget.value)
            }}
            placeholder="Live transcription output..."
            disabled={
              activeTab === null || pendingAction !== null || conflict !== null
            }
          />

          <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Transcription</span>
              <span className="text-xs text-muted-foreground">
                V{activeTab?.topTextVersion ?? "-"}{" "}
                {isTopTextDirty || autoSaveState.topText ? "⊛" : "💾"}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  void handleRecordButton()
                }}
                className={[
                  "rounded-md border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
                  recordingStatus === "recording"
                    ? "border-red-500/60 bg-red-500/15 text-red-700"
                    : "border-border bg-background hover:bg-accent",
                ].join(" ")}
                disabled={
                  activeTab === null ||
                  pendingAction !== null ||
                  isConflictActive ||
                  isStartBlockedByTopText
                }
              >
                {recordButtonLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  void handlePlayButton()
                }}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                disabled={
                  !canReplayRecording ||
                  isConflictActive ||
                  isActiveTabReplayRunning
                }
                aria-label="Play recording"
              >
                <Play className="size-4" aria-hidden="true" />
              </button>
              {isActiveTabReplayRunning || isActiveTabReplayPaused ? (
                <>
                  <button
                    type="button"
                    onClick={handlePauseButton}
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!isActiveTabReplayRunning || isConflictActive}
                    aria-label="Pause recording"
                  >
                    <Pause className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={stopActivePlayback}
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={
                      (!isActiveTabReplayRunning && !isActiveTabReplayPaused) ||
                      isConflictActive
                    }
                    aria-label="Stop recording playback"
                  >
                    <Square className="size-4" aria-hidden="true" />
                  </button>
                </>
              ) : null}
              <button
                type="button"
                onClick={handlePutText}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!canPutText}
                aria-label="Put transcription into summary"
              >
                <ArrowDown className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDebugPanelOpen((currentValue) => !currentValue)
                }}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!canDebugImproveResult || isConflictActive}
                aria-label={
                  isDebugPanelOpen ? "Hide debug panel" : "Show debug panel"
                }
              >
                <Bug className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 text-sm">
              <span className="text-xs text-muted-foreground">
                V{activeTab?.bottomTextVersion ?? "-"}{" "}
                {isBottomTextDirty || autoSaveState.bottomText ? "⊛" : "💾"}
              </span>
              <span className="font-medium">Summary</span>
            </div>
          </div>

          {isDebugPanelOpen && activeTabImproveResult ? (
            <div className="space-y-3 rounded-xl border border-border bg-background p-4">
              <h2 className="text-sm font-semibold">Debug Diff</h2>
              <div className="rounded-md border border-border bg-card p-3 text-sm leading-6">
                {debugDiffSegments.length === 0 ? (
                  <span className="text-muted-foreground">
                    No text changes detected.
                  </span>
                ) : (
                  debugDiffSegments.map((segment, index) => {
                    if (segment.kind === "removed") {
                      return (
                        <span
                          key={`diff-segment-${index}`}
                          className="mr-1 rounded-sm bg-red-500/10 px-1 text-red-700 line-through"
                        >
                          {segment.text}
                        </span>
                      )
                    }

                    if (segment.kind === "added") {
                      return (
                        <span
                          key={`diff-segment-${index}`}
                          className="mr-1 rounded-sm bg-emerald-500/10 px-1 text-emerald-700"
                        >
                          {segment.text}
                        </span>
                      )
                    }

                    return (
                      <span key={`diff-segment-${index}`} className="mr-1 px-1">
                        {segment.text}
                      </span>
                    )
                  })
                )}
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Whisper Raw
                  </p>
                  <div className="max-h-36 overflow-auto rounded-md border border-border bg-card p-2 text-sm">
                    {activeTabImproveResult.rawTranscriptionText}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Corrected
                  </p>
                  <div className="max-h-36 overflow-auto rounded-md border border-border bg-card p-2 text-sm">
                    {activeTabImproveResult.correctedText}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <textarea
              id="bottom-textarea"
              className="min-h-56 rounded-md border border-input bg-background px-3 py-2 text-[15px] outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              value={bottomTextDraft}
              onChange={(event) => {
                setBottomTextDraft(event.currentTarget.value)
              }}
              placeholder="Context and corrected terms..."
              disabled={
                activeTab === null ||
                (pendingAction !== null && !isProcessingRecording) ||
                conflict !== null
              }
            />
          )}
        </div>

        {conflict ? (
          <div className="mt-4 space-y-3 rounded-xl border border-amber-500/50 bg-amber-500/15 p-4">
            <div>
              <p className="text-sm font-semibold">
                Conflict detected: {conflict.field}
              </p>
              <p className="text-xs text-muted-foreground">
                Client expected version {conflict.expectedVersion}, server is
                version {conflict.serverVersion} (updated{" "}
                {new Date(conflict.serverUpdatedAt).toLocaleString()})
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Client draft
                </p>
                <div className="max-h-28 overflow-auto rounded-md border border-border bg-background p-2 text-sm">
                  {readDraftForField(conflict.field) || <em>(empty)</em>}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Server value
                </p>
                <div className="max-h-28 overflow-auto rounded-md border border-border bg-background p-2 text-sm">
                  {conflict.serverValue || <em>(empty)</em>}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleOverwriteServer}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                disabled={pendingAction !== null}
              >
                Use Server Data
              </button>
              <button
                type="button"
                onClick={handleOverwriteClient}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                disabled={pendingAction !== null}
              >
                Write Client to Server
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-3 rounded-md border border-border bg-background p-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {pendingAction || statusMessage ? (
                <div className="space-y-1">
                  {statusMessage ? (
                    <p className="text-sm text-muted-foreground">
                      {statusMessage}
                    </p>
                  ) : null}
                  {pendingAction ? (
                    <p className="text-xs text-muted-foreground">
                      Working: {pendingAction}
                    </p>
                  ) : null}
                </div>
              ) : activeTabImproveResult ? (
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span>
                    Transcription:{" "}
                    {activeTabImproveResult.transcriptionDurationMs} ms
                  </span>
                  <span>
                    Correction: {activeTabImproveResult.correctionDurationMs} ms
                  </span>
                  <span>
                    Total: {activeTabImproveResult.totalDurationMs} ms
                  </span>
                </div>
              ) : (
                "No timing metrics yet."
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                void handleCutBottomTextAndDeleteTab()
              }}
              disabled={
                activeTab === null ||
                pendingAction !== null ||
                bottomTextDraft.length === 0 ||
                isConflictActive
              }
              className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Copy bottom text and delete tab"
            >
              <Scissors className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
