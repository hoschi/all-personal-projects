import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"

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

const clientIdStorageKey = "sst-client-id"

function createFallbackClientId() {
  return `sst-client-${Math.random().toString(36).slice(2)}`
}

function getOrCreateClientId() {
  if (typeof window === "undefined") {
    return createFallbackClientId()
  }

  try {
    const existingClientId = window.localStorage.getItem(clientIdStorageKey)

    if (existingClientId) {
      return existingClientId
    }

    const nextClientId =
      window.crypto?.randomUUID?.() ?? createFallbackClientId()
    window.localStorage.setItem(clientIdStorageKey, nextClientId)
    return nextClientId
  } catch {
    return createFallbackClientId()
  }
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
  component: RouteComponent,
})

function RouteComponent() {
  const { initialTabs, initialActiveTabId } = Route.useLoaderData()

  const [clientId] = useState(() => getOrCreateClientId())
  const [tabs, setTabs] = useState(initialTabs)
  const [activeTabId, setActiveTabId] = useState(initialActiveTabId)
  const [activeTab, setActiveTab] = useState<TabSnapshot | null>(null)
  const [titleDraft, setTitleDraft] = useState("")
  const [topTextDraft, setTopTextDraft] = useState("")
  const [bottomTextDraft, setBottomTextDraft] = useState("")
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [conflict, setConflict] = useState<TabFieldConflict | null>(null)

  const activeTabTitle = activeTab?.title ?? "No active tab"

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
        `Conflict detected for ${field}. Choose overwrite action.`,
      )
      return false
    }

    setStatusMessage("This tab no longer exists on the server.")
    setConflict(null)
    setActiveTab(null)
    setTabs((currentTabs) =>
      currentTabs.filter((tab) => tab.id !== result.tabId),
    )
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
        setTabs((currentTabs) => currentTabs.filter((tab) => tab.id !== tabId))
        return
      }

      applyActiveTab(selectedTab)
      setConflict(null)
    } catch {
      setStatusMessage("Failed to load selected tab.")
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
    } catch {
      setStatusMessage("Failed to create a new tab.")
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
    } catch {
      setStatusMessage("Failed to save title.")
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
    } catch {
      setStatusMessage(`Failed to save ${field}.`)
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
        setStatusMessage("Server state accepted.")
      } else if (result.status === "not_found") {
        setStatusMessage("Tab no longer exists on the server.")
      }
    } catch {
      setStatusMessage("Failed to apply Overwrite Server.")
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
        setStatusMessage("Client state forced to server.")
      } else if (result.status === "not_found") {
        setStatusMessage("Tab no longer exists on the server.")
      }
    } catch {
      setStatusMessage("Failed to apply Overwrite Client.")
    } finally {
      setPendingAction(null)
    }
  }

  useEffect(() => {
    if (!activeTabId) {
      setActiveTab(null)
      return
    }

    void loadActiveTab(activeTabId)
  }, [activeTabId])

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
              >
                {tab.title}
              </button>
            )
          })}
          <button
            type="button"
            onClick={handleCreateTab}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
            disabled={pendingAction !== null}
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
              className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
              disabled
            >
              Record
            </button>
            <button
              type="button"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
              disabled
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
                Overwrite Server
              </button>
              <button
                type="button"
                onClick={handleOverwriteClient}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                disabled={pendingAction !== null}
              >
                Overwrite Client
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
