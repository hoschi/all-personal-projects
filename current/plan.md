# Plan: Matrix "Veränderung"-Zeile

## Ziel
Implementierung der Zeile **"Veränderung"** in `apps/financy-forecast/components/matrix.tsx` gemäß Anforderung: Delta zum Vormonat, farbig codiert.

## Scope
- Delta-Berechnung muss serverseitig stattfinden (keine Berechnungslogik im Client).
- `apps/financy-forecast/components/matrix.tsx` und bei Bedarf serverseitige Datenaufbereitung in `apps/financy-forecast/lib/data.ts` / `apps/financy-forecast/lib/types.ts` anpassen.
- Keine Änderung am Start/Stop des Dev-Servers (läuft bereits auf Port `3056`).

## Umsetzungsschritte
1. Serverseitige Datenstruktur erweitern, damit die Veränderungswerte in den Matrixdaten enthalten sind.
2. Delta-Werte serverseitig berechnen (in `getMatrixData`):
   - `delta[i] = sum[i] - sum[i-1]`
   - Für die erste Spalte ohne Vormonat `null`/neutralen Wert liefern.
3. In `matrix.tsx` die zusätzliche Tabellenzeile **"Veränderung"** ausschließlich aus den bereits berechneten Serverdaten rendern.
4. Delta-Werte im Rendering formatieren (`eurFormatter`) und farblich codieren:
   - positiv: grün
   - negativ: rot
   - null/kein Delta: neutral
5. Sicherstellen, dass keine Client-State-/Client-Calc-Logik eingeführt wird und Keys/Rendering stabil bleiben.

## Verifikation
1. Next MCP Runtime-Check gegen laufenden Server auf Port `3056`:
   - verfügbare Tools via `nextjs_index` prüfen
   - passende Error-/Runtime-Tools via `nextjs_call` ausführen
2. Monorepo-Qualitätscheck: `bun run ci` im Repo-Root.

## Erwartetes Ergebnis
- Matrix zeigt eine zusätzliche Zeile **"Veränderung"** mit Monatsdeltas gegenüber dem direkten Vormonat.
- Berechnung der Deltas erfolgt vollständig serverseitig vor dem Rendern.
- Farbcode entspricht Vorzeichen.
- Keine Runtime- oder CI-Fehler.
