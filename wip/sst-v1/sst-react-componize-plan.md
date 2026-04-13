# React Componize Plan: `apps/sst/src/routes/index.tsx`

## Scope

- Target file: `apps/sst/src/routes/index.tsx`
- Goal: decompose the oversized route file into focused feature modules without changing behavior.
- Constraint: structural refactor only (no feature or UX changes).

## Phase 1 — Analysis Summary

| File | Lines | Components | Hooks | Problems |
|------|-------|------------|-------|----------|
| `apps/sst/src/routes/index.tsx` | 1594 | 2 (`RouteComponent`, `IndexRouteErrorComponent`) | 33 hook calls (`useState`: 20, `useRef`: 4, `useEffect`: 7, `useEffectEvent`: 2) | Oversized file, mixed responsibilities, duplicate patterns, long functions, complex JSX |

### Detected violations

- Multiple components in a single file.
- Extractable inline hook logic (`tab load`, `autosave`, `persist active tab`, `cleanup`).
- Mixed concerns (data orchestration, domain logic, side effects, and rendering in one component).
- Repeated patterns (`pending/status/try-catch-finally`, button style/disabled logic).
- Overlong functions/components (`RouteComponent`, `buildWordDiffSegments`, `handleImproveFromRecording`, `updateFromWriteResult`).
- Deep JSX nesting and many conditional render branches.

## Phase 2 — Decomposition Plan (Approved Draft)

```text
BEFORE:
  apps/sst/src/routes/index.tsx (1594 lines, 2 components, 33 hook calls)

AFTER:
  apps/sst/src/routes/index.tsx                              (~80 lines, route + loader + feature root)
  apps/sst/src/features/sst/SstWorkspace.tsx                 (~120 lines, composition root)

  apps/sst/src/features/sst/components/
    SstHeader.tsx                                            (~35)
    TabBarControls.tsx                                       (~120)
    EditorPanels.tsx                                         (~130)
    ActionToolbar.tsx                                        (~110)
    DebugPanel.tsx                                           (~90)
    ConflictPanel.tsx                                        (~90)
    StatusMetricsBar.tsx                                     (~70)
    index.ts                                                 (barrel exports)

  apps/sst/src/features/sst/hooks/
    useSstTabs.ts                                            (~120)
    useSstRecording.ts                                       (~140)
    useSstAutosave.ts                                        (~80)
    useSstUiState.ts                                         (~50)
    index.ts                                                 (barrel exports)

  apps/sst/src/features/sst/utils/
    textDiff.ts                                              (~90)
    tabMappers.ts                                            (~40)
    browserStorage.ts                                        (~50)
```

## Component Contracts

### `SstWorkspace.tsx`
- Responsibility: compose feature UI and wire feature hooks.
- Props: `{ initialTabs: TabListItem[]; initialActiveTabId: string }`
- Local state: none (delegated to hooks).
- Events: delegates handler props to child components.

### `TabBarControls.tsx`
- Responsibility: tabs row, tab switching, new/delete/edit/save title controls.
- Props: active tab info, tab list, edit mode state, disabled flags, handlers.
- Local state: none.
- Events: `onTabChange`, `onCreateTab`, `onDeleteTab`, `onToggleEdit`, `onSaveTitle`.

### `EditorPanels.tsx`
- Responsibility: top textarea + bottom area (bottom textarea OR debug panel).
- Props: drafts, change handlers, disabled states, debug payload.
- Local state: none.

### `ActionToolbar.tsx`
- Responsibility: recording/playback/put/debug action buttons between editor panels.
- Props: button labels, booleans, handlers.
- Local state: none.

### `DebugPanel.tsx`
- Responsibility: render diff output, raw/corrected debug text.
- Props: diff segments + improve result.
- Local state: none.

### `ConflictPanel.tsx`
- Responsibility: render conflict details and overwrite actions.
- Props: conflict payload, draft/server values, pending state, handlers.
- Local state: none.

### `StatusMetricsBar.tsx`
- Responsibility: render status/pending text, timing stats, cut+delete action.
- Props: status, pending action, timing result, button state/handler.
- Local state: none.

## Hook Contracts

### `useSstTabs.ts`
- Responsibility: active tab lifecycle, tab CRUD/select/rename/delete, conflict baseline.
- Inputs: loader initial state, server fns, client id.
- Outputs: active tab state, drafts, tab mutation handlers, conflict state.

### `useSstRecording.ts`
- Responsibility: recording + playback + improve pipeline, including correct target tab writes.
- Inputs: active tab context, bottom draft context, update function(s).
- Outputs: recording/playback state + handlers + improve map.

### `useSstAutosave.ts`
- Responsibility: throttled top/bottom autosave and dirty/loading derivation.
- Inputs: active tab, drafts, pending/conflict, save callback.
- Outputs: autosave state + dirty flags.

### `useSstUiState.ts`
- Responsibility: purely presentational route-level UI states (debug open, title-edit mode, status message, pending action).
- Inputs: optional defaults.
- Outputs: state + setters/helpers.

## Implementation Rules (for later execution)

1. Bottom-up extraction order (leaf components first).
2. Keep project compiling after each extraction step.
3. No behavior changes.
4. Keep imports and barrel exports consistent.
5. Run `bun run check-types` and `bun run lint` after each logical chunk.

## Proposed extraction order

1. `utils/textDiff.ts`
2. `utils/tabMappers.ts`
3. `utils/browserStorage.ts`
4. `components/DebugPanel.tsx`
5. `components/ConflictPanel.tsx`
6. `components/StatusMetricsBar.tsx`
7. `components/TabBarControls.tsx`
8. `components/ActionToolbar.tsx`
9. `components/EditorPanels.tsx`
10. `hooks/useSstAutosave.ts`
11. `hooks/useSstRecording.ts`
12. `hooks/useSstTabs.ts`
13. `features/sst/SstWorkspace.tsx`
14. shrink `routes/index.tsx` to route/loader + workspace render
15. final pass (`check-types`, `lint`, behavior sanity)

## Out of scope

- No visual redesign.
- No API contract changes.
- No changes to server function behavior.
