import { z } from "zod"

const isoDateTimeSchema = z.string().datetime()

export const tabSyncFieldValues = ["title", "topText", "bottomText"] as const
export const tabSyncFieldSchema = z.enum(tabSyncFieldValues)
export type TabSyncField = z.infer<typeof tabSyncFieldSchema>

export const modelRunStageValues = ["transcription", "correction"] as const
export const modelRunStageSchema = z.enum(modelRunStageValues)
export type ModelRunStage = z.infer<typeof modelRunStageSchema>

export const modelProviderValues = ["whisper", "ollama", "unknown"] as const
export const modelProviderSchema = z.enum(modelProviderValues)
export type ModelProvider = z.infer<typeof modelProviderSchema>

export const tabIdSchema = z.string().min(1)
export type TabId = z.infer<typeof tabIdSchema>

const fieldVersionSchema = z.number().int().positive()

export const tabSnapshotSchema = z.object({
  id: tabIdSchema,
  title: z.string(),
  topText: z.string(),
  bottomText: z.string(),
  titleVersion: fieldVersionSchema,
  topTextVersion: fieldVersionSchema,
  bottomTextVersion: fieldVersionSchema,
  titleUpdatedAt: isoDateTimeSchema,
  topTextUpdatedAt: isoDateTimeSchema,
  bottomTextUpdatedAt: isoDateTimeSchema,
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})
export type TabSnapshot = z.infer<typeof tabSnapshotSchema>

export const tabListItemSchema = tabSnapshotSchema.pick({
  id: true,
  title: true,
  titleVersion: true,
  titleUpdatedAt: true,
  updatedAt: true,
})
export type TabListItem = z.infer<typeof tabListItemSchema>

export const createTabInputSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
})
export type CreateTabInput = z.infer<typeof createTabInputSchema>

export const deleteTabInputSchema = z.object({
  tabId: tabIdSchema,
})
export type DeleteTabInput = z.infer<typeof deleteTabInputSchema>

export const deleteTabResultSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("deleted"),
    tabId: tabIdSchema,
  }),
  z.object({
    status: z.literal("not_found"),
    tabId: tabIdSchema,
  }),
])
export type DeleteTabResult = z.infer<typeof deleteTabResultSchema>

export const renameTabInputSchema = z.object({
  tabId: tabIdSchema,
  title: z.string().trim().min(1).max(120),
  expectedVersion: fieldVersionSchema,
  clientId: z.string().trim().min(1),
})
export type RenameTabInput = z.infer<typeof renameTabInputSchema>

export const updateTabFieldInputSchema = z.object({
  tabId: tabIdSchema,
  field: tabSyncFieldSchema,
  value: z.string(),
  expectedVersion: fieldVersionSchema,
  clientId: z.string().trim().min(1),
})
export type UpdateTabFieldInput = z.infer<typeof updateTabFieldInputSchema>

export const moveTopTextToBottomInputSchema = z.object({
  tabId: tabIdSchema,
  topText: z.string(),
  bottomText: z.string(),
  topTextExpectedVersion: fieldVersionSchema,
  bottomTextExpectedVersion: fieldVersionSchema,
  clientId: z.string().trim().min(1),
})
export type MoveTopTextToBottomInput = z.infer<
  typeof moveTopTextToBottomInputSchema
>

export const overwriteServerInputSchema = z.object({
  tabId: tabIdSchema,
  field: tabSyncFieldSchema,
  clientId: z.string().trim().min(1),
})
export type OverwriteServerInput = z.infer<typeof overwriteServerInputSchema>

export const overwriteClientInputSchema = z.object({
  tabId: tabIdSchema,
  field: tabSyncFieldSchema,
  value: z.string(),
  clientId: z.string().trim().min(1),
})
export type OverwriteClientInput = z.infer<typeof overwriteClientInputSchema>

export const tabFieldConflictSchema = z.object({
  field: tabSyncFieldSchema,
  expectedVersion: fieldVersionSchema,
  serverVersion: fieldVersionSchema,
  clientValue: z.string(),
  serverValue: z.string(),
  serverUpdatedAt: isoDateTimeSchema,
})
export type TabFieldConflict = z.infer<typeof tabFieldConflictSchema>

export const tabWriteResultSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("updated"),
    tab: tabSnapshotSchema,
  }),
  z.object({
    status: z.literal("conflict"),
    conflict: tabFieldConflictSchema,
    tab: tabSnapshotSchema,
  }),
  z.object({
    status: z.literal("not_found"),
    tabId: tabIdSchema,
  }),
])
export type TabWriteResult = z.infer<typeof tabWriteResultSchema>

export const syncCursorSchema = z.object({
  tabId: tabIdSchema,
  clientId: z.string().trim().min(1),
  knownTitleVersion: fieldVersionSchema,
  knownTopTextVersion: fieldVersionSchema,
  knownBottomTextVersion: fieldVersionSchema,
  lastPulledAt: isoDateTimeSchema,
  lastPushedAt: isoDateTimeSchema.nullable(),
})
export type SyncCursor = z.infer<typeof syncCursorSchema>

export const upsertSyncCursorInputSchema = z.object({
  tabId: tabIdSchema,
  clientId: z.string().trim().min(1),
  knownTitleVersion: fieldVersionSchema,
  knownTopTextVersion: fieldVersionSchema,
  knownBottomTextVersion: fieldVersionSchema,
  lastPulledAt: isoDateTimeSchema,
  lastPushedAt: isoDateTimeSchema.optional(),
})
export type UpsertSyncCursorInput = z.infer<typeof upsertSyncCursorInputSchema>

export const createModelRunInputSchema = z.object({
  tabId: tabIdSchema.optional(),
  stage: modelRunStageSchema,
  provider: modelProviderSchema,
  modelId: z.string().trim().min(1),
  modelInput: z.string(),
  modelOutput: z.string(),
  durationMs: z.number().int().nonnegative().optional(),
  gitCommitHash: z.string().trim().min(7).max(64),
  metadata: z.record(z.string(), z.unknown()).optional(),
})
export type CreateModelRunInput = z.infer<typeof createModelRunInputSchema>

export const processTabRecordingInputSchema = z.object({
  tabId: tabIdSchema,
  contextText: z.string(),
  language: z.string().trim().min(2).max(12).optional(),
})
export type ProcessTabRecordingInput = z.infer<
  typeof processTabRecordingInputSchema
>

const durationMsSchema = z.number().int().nonnegative()

export const improveTextResultSchema = z.object({
  tabId: tabIdSchema,
  rawTranscriptionText: z.string().min(1),
  correctedText: z.string().min(1),
  whisperModelId: z.string().trim().min(1),
  ollamaModelId: z.string().trim().min(1),
  transcriptionDurationMs: durationMsSchema,
  correctionDurationMs: durationMsSchema,
  totalDurationMs: durationMsSchema,
})
export type ImproveTextResult = z.infer<typeof improveTextResultSchema>

export const modelRunLogSchema = z.object({
  id: z.string().min(1),
  tabId: tabIdSchema.nullable(),
  stage: modelRunStageSchema,
  provider: modelProviderSchema,
  modelId: z.string(),
  modelInput: z.string(),
  modelOutput: z.string(),
  durationMs: z.number().int().nonnegative().nullable(),
  gitCommitHash: z.string(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
  createdAt: isoDateTimeSchema,
})
export type ModelRunLog = z.infer<typeof modelRunLogSchema>
