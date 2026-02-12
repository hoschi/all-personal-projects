# Plan: Approve Feature (Dashboard Matrix)

## Analyse Ist-Stand
- In `apps/financy-forecast/components/matrix.tsx` existiert nur ein statischer `approve`-Button ohne Server-Action.
- Die Freigabe-Logik ist teilweise vorhanden: `calculateApprovable(lastDate)` in `apps/financy-forecast/domain/snapshots.ts`.
- DB-Bausteine sind vorhanden (`createAssetSnapshot`, `createBalanceDetailsForSnapshot`), aber kein orchestrierter Approve-Use-Case.
- `getMatrixData()` gibt aktuell `Option.none()` zurück, sobald keine Snapshots existieren. `Option.none()` soll aber nur für den Fall genutzt werden, dass insgesamt keine darstellbaren Daten vorhanden sind (z. B. neuer User ohne Kontodaten).
- Datums-Konvention ist absichtlich: `asset_snapshots.date` speichert den 1. Tag des Monats (`CHECK EXTRACT(DAY)=1`), weil nur der Monat relevant ist.

## Ziel
Approve-Flow gemäß Requirements umsetzen:
- Provisorische Current-Werte per Klick bestätigen.
- Bei erlaubtem Zeitpunkt Snapshot erzeugen.
- Bei zu frühem Zeitpunkt klar als provisorisch kennzeichnen (`Est.`).
- Erst-Snapshot-Fall unterstützen.

## Annahme zur Datumslogik
- Die bestehende Konvention bleibt unverändert und ist fachlich korrekt:
  - Snapshot-Datum wird intern als **1. Tag des Monats** gespeichert.
  - Der konkrete Tag ist nicht fachlich relevant, nur der Monat.

## Umsetzungsschritte
1. Domain-Regeln für Snapshot-Termine ergänzen
- In `apps/financy-forecast/domain/snapshots.ts` Helper ergänzen:
  - Ermittlung des nächsten freigebbaren Snapshot-Monats aus letztem Snapshot.
  - Ermittlung des Initial-Snapshot-Monats (Vormonat) bei fehlendem Snapshot.
- Bestehende `calculateApprovable`-Logik weiterverwenden.

2. DB-Use-Case für Approve einführen
- In `apps/financy-forecast/lib/db.ts` eine orchestrierte Funktion ergänzen (z. B. `approveCurrentBalancesAsSnapshot(snapshotDate)`).
- Ablauf:
  - Konten laden.
  - `totalLiquidity` aus LIQUID-Konten berechnen.
  - Snapshot anlegen.
  - Balance-Details für alle Konten anlegen.
- Fehlerbehandlung und Debug-Logging analog bestehender DB-Funktionen.

3. Server Action für Approve bauen
- In `apps/financy-forecast/lib/actions.ts` neue Action ergänzen (z. B. `handleApproveSnapshot`).
- Ablauf:
  - Letzten Snapshot laden.
  - Approve-Berechtigung prüfen (oder Initial-Fall erlauben).
  - Snapshot-Datum bestimmen.
  - DB-Use-Case ausführen.
  - Cache invalidieren (`updateTag("snapshots")`, bei Bedarf zusätzlich `updateTag("accounts")`).
  - Typisiertes Success/Error-Result zurückgeben.

4. Matrix-Datenmodell für UI-Status erweitern
- In `apps/financy-forecast/lib/types.ts` und `apps/financy-forecast/lib/data.ts` Matrix-Metadaten ergänzen, damit die UI rein serverseitig entschiedene Statusdaten bekommt:
  - `isApprovable`
  - `isInitialState` oder äquivalent
  - benötigte Flags für UI-Entscheidung, aber **kein** fertiges Label aus dem Backend
- `getMatrixData()` so anpassen:
  - `Option.none()` bleibt für den Fall „keine Daten vorhanden“ (z. B. keine Konten/kein Current-Wert darstellbar).
  - Wenn Current-Werte vorhanden sind, soll die Matrix auch ohne Snapshot gerendert werden (Initial-Flow).

5. UI in Matrix anbinden
- In `apps/financy-forecast/components/matrix.tsx` den Approve-Button an die neue Server Action binden (Form-Action).
- Requirements-UI umsetzen:
  - Label-Logik liegt **im Frontend** (aus den gelieferten Flags abgeleitet).
  - approvable: `✅`-Button
  - nicht approvable: `Est.`-Label
- Bestehende Tabellenlogik (inkl. Veränderungszeile) beibehalten.

6. Tests ergänzen/anpassen
- `apps/financy-forecast/domain/snapshots.test.ts`: neue Datums-Helper und Initial-Fall testen.
- `apps/financy-forecast/lib/data.test.ts`: no-snapshot-Verhalten auf neuen Initial-State anpassen.
- `apps/financy-forecast/lib/actions`-Tests ergänzen (Erfolg, zu früh, DB-Fehler).

## Verifikation nach Umsetzung
1. Next MCP auf Port `3056`
- `nextjs_call(get_errors)` vor/nach Änderung.
- `/dashboard` per Browser-MCP öffnen und prüfen:
  - `Est.` sichtbar wenn zu früh.
  - `✅`-Approve-Button im freigebbaren Zustand.
  - Nach Klick neuer Snapshot in Matrix sichtbar.

2. Qualitätslauf
- Im Monorepo-Root: `bun run ci`.

## Erwartetes Ergebnis
- Approve-Feature ist funktional von UI bis DB.
- Erst-Snapshot und Folgesnapshot-Fall funktionieren.
- Cache/Rendering aktualisieren sich korrekt nach Approve.
- Keine Runtime-, Type-, Lint- oder Testfehler.
