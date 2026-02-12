# Plan: Dashboard "✏️ neben Current" umsetzen

## Scope aus Requirement
- In der Matrix-Tabelle soll neben `Current` ein klickbares Bleistift-Element erscheinen.
- Klick navigiert nach `/current/edit`.
- Dort Side-by-side Ansicht:
  - links: read-only Werte aus letztem Snapshot,
  - rechts: Eingabefelder für aktuelle Kontostände.
- Pro Konto anzeigen:
  - `updated-at` relativ, absolut auf Hover,
  - Differenz zu Snapshot mit gleicher Farb-Logik wie Matrix.
- `Save` speichert neue `current_balance`-Werte und navigiert zurück zu `/dashboard`.
- UI mit shadcn-Komponenten.

## Geplante Umsetzung
1. Datenmodell erweitern (`updatedAt` für Accounts)
- Datei: `apps/financy-forecast/lib/schemas.ts`
- `Account` um `updatedAt: z.date()` erweitern.
- Alle DB-Selects auf `accounts` so anpassen, dass `updated_at as "updatedAt"` mitkommt.

2. DB- und Action-Funktionen für Edit-Flow hinzufügen
- Datei: `apps/financy-forecast/lib/db.ts`
- Neue Funktion für Snapshot-Vergleichsdaten:
  - lädt aktuelle Accounts,
  - lädt letzten Snapshot (falls vorhanden) + Balance-Details,
  - mapped Snapshot-Balance je Account.
- Neue Bulk-Update-Funktion für Kontostände (transaktional), setzt `updated_at = CURRENT_TIMESTAMP` nur pro betroffenem Konto (nur wenn sich `current_balance` geändert hat).
- Datei: `apps/financy-forecast/lib/actions.ts`
- Neue Server Action `handleSaveCurrentBalances(...)` mit Zod-Validierung, DB-Update, `updateTag("accounts")` und Redirect.

3. Route `/current/edit` bauen (Server Page + UI)
- Neue Datei: `apps/financy-forecast/app/current/edit/page.tsx`
- Header analog zu anderen Seiten (`SidebarTrigger`, Titel/Subtitel).
- Neue Komponente (shadcn-basiert) für Side-by-side-Layout:
  - z. B. `apps/financy-forecast/components/current-edit.tsx`
  - Links Read-only Snapshot-Spalte (oder Placeholder wenn kein Snapshot existiert).
  - Rechts `Input` je Konto für Current-Balance.
  - `Tooltip` für absolutes Datum, relative Zeit via `date-fns`.
  - Delta-Farbe mit bestehender Semantik (grün/rot/muted).
  - Save per `<form action={...}>`.

4. Matrix-Header um Pencil-Trigger ergänzen
- Datei: `apps/financy-forecast/components/matrix.tsx`
- In der Header-Zelle `Current` einen kleinen Link/Button (✏️) nach `/current/edit` ergänzen.
- Nur in der `Current`-Spalte, ohne bestehende Snapshot-Approve-Logik zu verändern.

5. Tests ergänzen/anpassen
- Datei: `apps/financy-forecast/lib/data.test.ts` ggf. anpassen, falls `Account`-Shape jetzt `updatedAt` erwartet.
- Neue Tests für neue Action/DB-Mapping (mindestens Action-Validierung + Erfolgspfad).
- Sicherstellen, dass bestehende Tests weiterhin grün sind.

6. Validierung nach Implementierung
- Next MCP verwenden (kein Neustart von Dev-Server):
  - `nextjs_index` mit Port `3056`,
  - dann Tooling für Laufzeit-/Compile-Errors prüfen.
- Danach im Repo-Root: `bun run ci` ausführen und Fehler beheben.

## Hinweise
- Ich implementiere den Pencil als Emoji (`✏️`), wie im Requirement formuliert.
- Für den Fallback ohne Snapshot zeige ich links pro Konto `—` statt Wert, damit Edit trotzdem möglich bleibt.
- Geldwerte bleiben intern Integer Cents; Eingaben werden in Euro angezeigt und beim Speichern in Cents konvertiert.
