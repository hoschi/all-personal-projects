import {
  ErrorComponent,
  createFileRoute,
  type ErrorComponentProps,
} from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"

import type {
  TabFieldConflict,
  TabListItem,
  TabSnapshot,
  TabSyncField,
  TabWriteResult,
} from "@/contracts/tab-sync"
import {
  createTabFn,
  listTabsFn,
  overwriteClientFn,
  overwriteServerFn,
  renameTabFn,
  selectTabFn,
  updateTabFieldFn,
} from "@/data/tab-sync-actions"
import { improveTabRecordingFn } from "@/data/text-improvement-actions"

const CLIENT_ID_STORAGE_KEY = "sst-client-id" as const
const ACTIVE_TAB_STORAGE_PREFIX = "sst-active-tab-id" as const
const DEFAULT_IMPROVE_LANGUAGE = "de" as const
const WAV_MIME_TYPE = "audio/wav" as const

type RecordingStatus = "idle" | "recording"

type TabLocalRecording = {
  audioBlob: Blob
  objectUrl: string
  sizeLabel: string
}

function writeAsciiString(view: DataView, byteOffset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(byteOffset + index, value.charCodeAt(index))
  }
}

function encodeAudioBufferAsWav(audioBuffer: AudioBuffer) {
  const channelCount = audioBuffer.numberOfChannels
  const sampleRate = audioBuffer.sampleRate
  const frameCount = audioBuffer.length
  const bytesPerSample = 2
  const blockAlign = channelCount * bytesPerSample
  const byteRate = sampleRate * blockAlign
  const dataByteLength = frameCount * blockAlign
  const wavBuffer = new ArrayBuffer(44 + dataByteLength)
  const wavView = new DataView(wavBuffer)

  writeAsciiString(wavView, 0, "RIFF")
  wavView.setUint32(4, 36 + dataByteLength, true)
  writeAsciiString(wavView, 8, "WAVE")
  writeAsciiString(wavView, 12, "fmt ")
  wavView.setUint32(16, 16, true)
  wavView.setUint16(20, 1, true)
  wavView.setUint16(22, channelCount, true)
  wavView.setUint32(24, sampleRate, true)
  wavView.setUint32(28, byteRate, true)
  wavView.setUint16(32, blockAlign, true)
  wavView.setUint16(34, 16, true)
  writeAsciiString(wavView, 36, "data")
  wavView.setUint32(40, dataByteLength, true)

  let dataOffset = 44

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    for (let channelIndex = 0; channelIndex < channelCount; channelIndex += 1) {
      const sample = audioBuffer.getChannelData(channelIndex)[frameIndex] ?? 0
      const clampedSample = Math.max(-1, Math.min(1, sample))
      const int16Sample =
        clampedSample < 0
          ? Math.round(clampedSample * 0x8000)
          : Math.round(clampedSample * 0x7fff)

      wavView.setInt16(dataOffset, int16Sample, true)
      dataOffset += bytesPerSample
    }
  }

  return new Blob([wavBuffer], { type: WAV_MIME_TYPE })
}

async function convertBlobToWav(blob: Blob): Promise<Blob> {
  if (blob.type === WAV_MIME_TYPE) {
    return blob
  }

  if (typeof AudioContext === "undefined") {
    throw new Error("AudioContext API is not available in this browser.")
  }

  const audioContext = new AudioContext()

  try {
    const encodedBuffer = await blob.arrayBuffer()
    const decodedAudio = await audioContext.decodeAudioData(
      encodedBuffer.slice(0),
    )
    return encodeAudioBufferAsWav(decodedAudio)
  } finally {
    await audioContext.close()
  }
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

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()

    fileReader.onerror = () => {
      reject(new Error("Failed to read recording blob."))
    }

    fileReader.onloadend = () => {
      if (typeof fileReader.result !== "string") {
        reject(new Error("Recording blob conversion failed."))
        return
      }

      const [, base64Payload] = fileReader.result.split(",", 2)

      if (!base64Payload) {
        reject(new Error("Recording base64 payload is empty."))
        return
      }

      resolve(base64Payload)
    }

    fileReader.readAsDataURL(blob)
  })
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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Array<BlobPart>>([])
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const tabRecordingsRef = useRef<Record<string, TabLocalRecording>>({})

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
  const [tabRecordings, setTabRecordings] = useState<
    Record<string, TabLocalRecording>
  >({})
  const [runtimeError, setRuntimeError] = useState<Error | null>(null)

  if (runtimeError) {
    throw runtimeError
  }

  const activeTabTitle = activeTab?.title ?? "No active tab"
  const activeTabRecording = activeTab
    ? (tabRecordings[activeTab.id] ?? null)
    : null
  const hasActiveTabRecording =
    activeTabRecording !== null && activeTabRecording.audioBlob.size > 0
  const isRecordingInProgress =
    recordingStatus === "recording" || recordingTabId !== null
  const canReplayRecording =
    hasActiveTabRecording && !isRecordingInProgress && pendingAction === null
  const canImproveText =
    hasActiveTabRecording && !isRecordingInProgress && pendingAction === null
  const isActiveTabReplayRunning =
    activeTab !== null && playingTabId === activeTab.id
  const recordButtonLabel =
    recordingStatus === "recording" ? "Stop Recording" : "Record"
  const replayButtonLabel = isActiveTabReplayRunning ? "Stop" : "Play"

  const canSaveTitle =
    activeTab !== null &&
    titleDraft.trim().length > 0 &&
    titleDraft.trim() !== activeTab.title
  const canSaveTopText =
    activeTab !== null && topTextDraft !== activeTab.topText
  const canSaveBottomText =
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

  async function handleImproveText() {
    if (!activeTab || !activeTabRecording) {
      return
    }

    setPendingAction("improve-text")
    setStatusMessage(null)

    try {
      const wavBlob = await convertBlobToWav(activeTabRecording.audioBlob)
      const audioBase64 = await blobToBase64(wavBlob)
      const improveResult = await improveTabRecordingFn({
        data: {
          tabId: activeTab.id,
          audioBase64,
          audioMimeType: wavBlob.type || WAV_MIME_TYPE,
          contextText: bottomTextDraft,
          language: DEFAULT_IMPROVE_LANGUAGE,
        },
      })

      setTopTextDraft(improveResult.correctedText)

      const writeResult = await updateTabFieldFn({
        data: {
          tabId: activeTab.id,
          field: "topText",
          value: improveResult.correctedText,
          expectedVersion: activeTab.topTextVersion,
          clientId,
        },
      })

      const wasSaved = updateFromWriteResult(writeResult, "topText")

      if (wasSaved) {
        setStatusMessage(
          `Improve Text finished (${improveResult.totalDurationMs} ms total).`,
        )
      }
    } catch (error) {
      setRuntimeError(toRuntimeError(error, "Failed to improve text."))
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

    if (typeof MediaRecorder === "undefined") {
      throw new Error("MediaRecorder API is not available in this browser.")
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Audio recording is not supported in this browser.")
    }

    stopActivePlayback()
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    })
    const mediaRecorder = new MediaRecorder(mediaStream)

    mediaStreamRef.current = mediaStream
    mediaRecorderRef.current = mediaRecorder
    audioChunksRef.current = []
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data)
      }
    }

    mediaRecorder.start()
    setRecordingTabId(activeTab.id)
    setRecordingStatus("recording")
    setStatusMessage("Recording started.")
  }

  async function stopRecording() {
    const mediaRecorder = mediaRecorderRef.current

    if (!mediaRecorder || mediaRecorder.state === "inactive") {
      throw new Error("Recording is not active.")
    }

    const targetTabId = recordingTabId ?? activeTab?.id

    if (!targetTabId) {
      throw new Error("No tab is available to store the recording.")
    }

    const audioBlob = await new Promise<Blob>((resolve, reject) => {
      mediaRecorder.onstop = () => {
        const nextAudioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        })

        if (nextAudioBlob.size === 0) {
          reject(new Error("Recorded audio blob is empty."))
          return
        }

        resolve(nextAudioBlob)
      }

      mediaRecorder.onerror = () => {
        reject(new Error("Recording failed while stopping."))
      }

      mediaRecorder.stop()
    })

    stopActiveMediaStream()
    mediaRecorderRef.current = null
    audioChunksRef.current = []
    setRecordingStatus("idle")
    setRecordingTabId(null)
    storeTabRecording(targetTabId, audioBlob)
    setStatusMessage(`Saved local recording (${bytesToSize(audioBlob.size)}).`)
  }

  async function handleRecordButton() {
    setStatusMessage(null)

    try {
      if (recordingStatus === "recording") {
        await stopRecording()
        return
      }

      await startRecordingForActiveTab()
    } catch (error) {
      stopActiveMediaStream()
      mediaRecorderRef.current = null
      audioChunksRef.current = []
      setRecordingStatus("idle")
      setRecordingTabId(null)
      setRuntimeError(
        toRuntimeError(error, "Failed to handle audio recording."),
      )
    }
  }

  async function handleReplayButton() {
    if (!activeTab || !activeTabRecording) {
      return
    }

    setStatusMessage(null)

    try {
      if (playingTabId === activeTab.id) {
        stopActivePlayback()
        return
      }

      stopActivePlayback()
      const audioPlayer = new Audio(activeTabRecording.objectUrl)

      audioPlayerRef.current = audioPlayer
      setPlayingTabId(activeTab.id)
      audioPlayer.onended = () => {
        setPlayingTabId((currentPlayingTabId) =>
          currentPlayingTabId === activeTab.id ? null : currentPlayingTabId,
        )
        audioPlayerRef.current = null
      }

      await audioPlayer.play()
    } catch (error) {
      stopActivePlayback()
      setRuntimeError(toRuntimeError(error, "Failed to replay recording."))
    }
  }

  function updateFromWriteResult(
    result: TabWriteResult,
    field: TabSyncField,
  ): boolean {
    if (result.status === "updated") {
      applyActiveTab(result.tab)
      setConflict(null)
      setStatusMessage(`${field} was saved.`)
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

  async function handleSaveTextField(field: "topText" | "bottomText") {
    if (!activeTab) {
      return
    }

    const expectedVersion =
      field === "topText"
        ? activeTab.topTextVersion
        : activeTab.bottomTextVersion
    const value = field === "topText" ? topTextDraft : bottomTextDraft

    setPendingAction(`save-${field}`)
    setStatusMessage(null)

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

      updateFromWriteResult(result, field)
    } catch (error) {
      setRuntimeError(toRuntimeError(error, `Failed to save ${field}.`))
    } finally {
      setPendingAction(null)
    }
  }

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
    return () => {
      const mediaRecorder = mediaRecorderRef.current

      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop()
      }

      stopActiveMediaStream()
      stopActivePlayback()
      Object.values(tabRecordingsRef.current).forEach((recording) => {
        URL.revokeObjectURL(recording.objectUrl)
      })
    }
  }, [])

  return (
    <main className="space-y-6">
      <header className="rounded-xl border border-border bg-card p-4 shadow-xs sm:p-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          SST v0
        </p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
          Speech-To-Structured-Text Workspace
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tabbed editor with server-backed sync and explicit conflict
          resolution.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-4 shadow-xs sm:p-6">
        <div className="mb-4 flex flex-wrap gap-2 border-b border-border pb-4">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStatusMessage(null)
                  setConflict(null)
                  setActiveTabId(tab.id)
                }}
                className={[
                  "rounded-md border px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-foreground hover:bg-accent",
                ].join(" ")}
                disabled={recordingStatus === "recording"}
              >
                {tab.title}
              </button>
            )
          })}
          <button
            type="button"
            onClick={handleCreateTab}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
            disabled={pendingAction !== null || recordingStatus === "recording"}
          >
            + New Tab
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Active Tab</p>
            <p className="text-sm text-muted-foreground">{activeTabTitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                void handleRecordButton()
              }}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
              disabled={activeTab === null || pendingAction !== null}
            >
              {recordButtonLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                void handleReplayButton()
              }}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!canReplayRecording}
            >
              {replayButtonLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                void handleImproveText()
              }}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
              disabled={!canImproveText}
            >
              Improve Text
            </button>
            <button
              type="button"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
              disabled
            >
              Debug
            </button>
          </div>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          {activeTabRecording
            ? `Latest local recording: ${activeTabRecording.sizeLabel}`
            : "No local recording available for this tab."}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="tab-title-input">
            Tab Title
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="tab-title-input"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              value={titleDraft}
              onChange={(event) => {
                setTitleDraft(event.currentTarget.value)
              }}
              disabled={activeTab === null || pendingAction !== null}
            />
            <button
              type="button"
              onClick={handleSaveTitle}
              disabled={!canSaveTitle || pendingAction !== null}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              Save Title
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              Top Textbox (transcription)
            </span>
            <textarea
              className="min-h-56 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              value={topTextDraft}
              onChange={(event) => {
                setTopTextDraft(event.currentTarget.value)
              }}
              placeholder="Live transcription output..."
              disabled={activeTab === null || pendingAction !== null}
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                Version: {activeTab?.topTextVersion ?? "-"}
              </span>
              <button
                type="button"
                onClick={() => {
                  void handleSaveTextField("topText")
                }}
                disabled={!canSaveTopText || pendingAction !== null}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save Top Text
              </button>
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Bottom Textbox</span>
            <textarea
              className="min-h-56 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              value={bottomTextDraft}
              onChange={(event) => {
                setBottomTextDraft(event.currentTarget.value)
              }}
              placeholder="Context and corrected terms..."
              disabled={activeTab === null || pendingAction !== null}
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                Version: {activeTab?.bottomTextVersion ?? "-"}
              </span>
              <button
                type="button"
                onClick={() => {
                  void handleSaveTextField("bottomText")
                }}
                disabled={!canSaveBottomText || pendingAction !== null}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save Bottom Text
              </button>
            </div>
          </label>
        </div>

        {conflict ? (
          <div className="mt-4 space-y-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
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

        {statusMessage ? (
          <p className="mt-4 text-sm text-muted-foreground">{statusMessage}</p>
        ) : null}

        {pendingAction ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Working: {pendingAction}
          </p>
        ) : null}
      </section>
    </main>
  )
}
