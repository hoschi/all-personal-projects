# Plan: `main-rules.md` mit Tools-Logik + Husky orchestrieren

## Ziel

Bei jedem Commit soll eine Änderung in `ai-assistants/main-rules.md` automatisch nach

- `.roo/rules/main-rules.md`
- `.kilocode/rules/main-rules.md`

kopiert und direkt dem selben Commit hinzugefügt werden.

## Umsetzungsschritte

1. Tool-Logik im `packages/tools` implementieren
- Neue Datei in `packages/tools/src` anlegen (z. B. `sync-main-rules.ts`).
- Diese Datei enthält **nur** die Dateisynchronisierung:
  - Source: `ai-assistants/main-rules.md`
  - Targets: `.roo/rules/main-rules.md`, `.kilocode/rules/main-rules.md`
- Keine Git-Befehle in der Tool-Logik.
- Optionalen Script-Eintrag in `packages/tools/package.json` ergänzen (`sync-main-rules`).

2. Husky nur für Git-Teil einrichten
- `husky` als `devDependency` im Repo-Root ergänzen.
- Root-`package.json`: `prepare` Script für Husky hinzufügen.
- `.husky/pre-commit` anlegen:
  - Prüft per `git diff --cached --name-only -- ai-assistants/main-rules.md`, ob Source staged geändert ist.
  - Führt nur dann `bun run packages/tools/src/sync-main-rules.ts` aus.
  - Führt danach `git add .roo/rules/main-rules.md .kilocode/rules/main-rules.md` aus.
- Damit bleibt die Trennung sauber: Tool = Dateiinhalt, Husky = Git-Index/Hook-Orchestrierung.

3. Verifikation der Hook-Kette
- Positivfall:
  - Source ändern, `git add ai-assistants/main-rules.md`, commit.
  - Prüfen, dass beide Target-Dateien automatisch synchronisiert und im Commit enthalten sind.
- No-Op:
  - Commit ohne staged Änderung an der Source.
  - Hook darf nichts ändern.
- Integrität:
  - Alle drei Dateien müssen bytegleich sein.

4. README-Anpassungen am Schluss
- Root-`README.md` ergänzen:
  - Hinweis auf automatische Spiegelung der `main-rules.md` via pre-commit Hook.
  - Single Source of Truth klar benennen.
- `packages/tools/README.md` ergänzen:
  - neues Tool-Skript dokumentieren (`sync-main-rules`).
  - Rollenaufteilung Tool vs. Husky kurz beschreiben.

## Commit-Strategie (inkrementell)

1. Commit 1: Plan erweitert (`current/plan.md`).
2. Commit 2: Tool-Logik in `packages/tools` + ggf. Script-Eintrag.
3. Commit 3: Husky-Setup + pre-commit Git-Orchestrierung.
4. Commit 4: README-Updates (Root + `packages/tools`).

## Verifikation

1. Positivfall
- `ai-assistants/main-rules.md` ändern, committen.
- Erwartung:
  - `.roo/rules/main-rules.md` und `.kilocode/rules/main-rules.md` enthalten denselben Inhalt.
  - Beide Dateien sind im selben Commit enthalten.

2. No-Op-Fall
- Commit ohne Änderung an `ai-assistants/main-rules.md`.
- Erwartung:
  - Hook verändert nichts.
  - Commit läuft normal durch.

3. Integritätscheck
- Nach Test-Commit:
  - `cmp`/`diff` zwischen allen drei Dateien zeigt keine Unterschiede.

## Akzeptanzkriterien

- Single Source of Truth ist `ai-assistants/main-rules.md`.
- Jede committe Änderung an dieser Datei synchronisiert automatisch in die beiden anderen Dateien.
- Die synchronisierten Dateien werden ohne manuelles `git add` mitcommitted.
- Sync-Logik liegt im `packages/tools`-Code, Git-Logik nur im Husky Hook.
- Commits ohne relevante Änderung werden nicht beeinflusst.
