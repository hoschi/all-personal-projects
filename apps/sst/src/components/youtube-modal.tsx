import { useEffect, useState } from "react"

export type YoutubeValidationResult =
  | { kind: "idle" }
  | { kind: "validating" }
  | { kind: "error"; message: string }
  | {
      kind: "reusable"
      video: { youtubeId: string; displayTitle: string; channelName: string }
    }
  | {
      kind: "ready_for_enrichment"
      video: { youtubeId: string; channelName: string }
    }

interface YoutubeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: { url: string }) => void
  onConfirmBind: (input: { youtubeId: string; reuse: boolean }) => void
  validationResult: YoutubeValidationResult
}

export function YoutubeModal({
  isOpen,
  onClose,
  onSubmit,
  onConfirmBind,
  validationResult,
}: YoutubeModalProps) {
  const [urlDraft, setUrlDraft] = useState("")

  // Reset URL-Eingabe bei jedem Modal-Open — sonst klebt der URL vom letzten Tab.
  useEffect(() => {
    if (isOpen) setUrlDraft("")
  }, [isOpen])

  if (!isOpen) return null

  const isValidating = validationResult.kind === "validating"
  const isError = validationResult.kind === "error"
  const isReusable = validationResult.kind === "reusable"
  const isReady = validationResult.kind === "ready_for_enrichment"

  const buttonLabel = isValidating
    ? "Validating..."
    : isReusable
      ? "Re-use Video"
      : "Start Processing"

  function handleSubmit() {
    if (isReusable && validationResult.kind === "reusable") {
      onConfirmBind({
        youtubeId: validationResult.video.youtubeId,
        reuse: true,
      })
      return
    }
    if (isReady && validationResult.kind === "ready_for_enrichment") {
      onConfirmBind({
        youtubeId: validationResult.video.youtubeId,
        reuse: false,
      })
      return
    }
    onSubmit({ url: urlDraft })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add YouTube Video</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-md px-2 py-1 hover:bg-accent"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <input
            type="url"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.currentTarget.value)}
            placeholder="https://youtu.be/..."
            disabled={isValidating}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />

          {isError && validationResult.kind === "error" && (
            <div className="rounded-md border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-700">
              {validationResult.message}
            </div>
          )}

          {isReusable && validationResult.kind === "reusable" && (
            <div className="rounded-md border border-blue-500/50 bg-blue-500/10 p-3 text-sm text-blue-700">
              Video bereits in KB enriched: «
              {validationResult.video.displayTitle}» —{" "}
              {validationResult.video.channelName}
            </div>
          )}

          {isReady && validationResult.kind === "ready_for_enrichment" && (
            <div className="rounded-md border border-green-500/50 bg-green-500/10 p-3 text-sm text-green-700">
              Bereit zum Enrichment: {validationResult.video.channelName}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-accent"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isValidating || urlDraft.length === 0}
            className="rounded-md border border-primary bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
