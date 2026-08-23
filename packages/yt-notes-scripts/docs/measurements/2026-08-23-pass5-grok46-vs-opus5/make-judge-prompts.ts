/**
 * Baut je Video eine verblindete Richter-Vorlage: Transkript (audited_md) plus
 * die beiden Zusammenfassungen als "Fassung A" und "Fassung B". Die Zuordnung
 * A/B wechselt je Video-Art ab (zweimal Grok als A, zweimal als B) und steht in
 * judge/_zuordnung.json — der Richter erfaehrt sie nicht.
 *
 * Aufruf (aus packages/yt-notes-scripts):
 *   bun run docs/measurements/2026-08-23-pass5-grok46-vs-opus5/make-judge-prompts.ts
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

import { prisma } from "../../../src/db"
import { findH2Sections, parseStub } from "../../../src/markdown-parser"

const RUN_DIR = dirname(new URL(import.meta.url).pathname)

/** Zieht die Pass-5-Sektionen aus dem Vault-Stub (ohne Frontmatter, H1, Notizen). */
function pass5TeilAusStub(md: string): string {
  const body = parseStub(md).body
  const secs = findH2Sections(body)
  const teile: string[] = []
  for (const s of secs) {
    if (s.heading === "Notizen") continue
    teile.push(body.slice(s.start, s.end).replace(/\n*---\n*$/, "").trimEnd())
  }
  return teile.join("\n\n")
}

const metas = JSON.parse(
  readFileSync(join(RUN_DIR, "meta", "_index.json"), "utf-8"),
) as { youtubeId: string; art: string; title: string }[]

const zuordnung: Record<string, { A: string; B: string }> = {}

// Ausgewogene Verblindung statt Zufall: je Video-Art bekommt Grok zweimal die
// Position A und zweimal die Position B. Eine ungleiche Verteilung wuerde die
// bekannte Positions-Vorliebe von Richter-Modellen auf einen Arm legen.
const laufNrJeArt: Record<string, number> = {}

for (const meta of metas) {
  const grokPfad = join(RUN_DIR, "grok", `${meta.youtubeId}.raw.md`)
  if (!existsSync(grokPfad)) continue

  const opus = pass5TeilAusStub(
    readFileSync(join(RUN_DIR, "opus", `${meta.youtubeId}.md`), "utf-8"),
  )
  const grok = readFileSync(grokPfad, "utf-8").trim()

  const nr = (laufNrJeArt[meta.art] = (laufNrJeArt[meta.art] ?? 0) + 1)
  const grokIstA = nr % 2 === 1
  zuordnung[meta.youtubeId] = grokIstA
    ? { A: "grok", B: "opus" }
    : { A: "opus", B: "grok" }

  const transkript = (
    await prisma.transcript.findUniqueOrThrow({
      where: { youtubeId: meta.youtubeId },
    })
  ).auditedMd

  const text = `# Bewertungsauftrag: zwei Zusammenfassungen desselben Videos

Du bekommst das aufbereitete Transkript eines YouTube-Videos und zwei
unabhaengig erzeugte deutsche Zusammenfassungen davon (Fassung A und Fassung B).
Welches Modell welche Fassung geschrieben hat, erfaehrst du nicht und sollst du
nicht raten.

## Die Regeln, nach denen beide Fassungen erzeugt wurden

- Sektionen in dieser Reihenfolge: "## Worum es geht" (1-2 Saetze),
  "## Besprochene Konzepte", "## Behauptungen", "## Demos / Schritte" (nur wenn
  etwas vorgefuehrt wird), "## Genannte Tools" (nur wenn Tools genannt werden),
  "## Verwandt".
- Nur was der Sprecher tatsaechlich sagt. Eigene Spekulation des Modells ist
  verboten: keine eigene Deutung ("vermutlich meint der Sprecher"), keine
  eigenen Schluesse ("daraus folgt"), keine Vorausschau. Spekulation des
  SPRECHERS darf uebernommen werden, markiert mit "laut Sprecher".
- Bei Unsicherheit, ob eine Behauptung woertlich ins Original zurueckfuehrbar
  ist: weglassen.
- Sprache deutsch. Fachbegriffe, Produkt- und Befehlsnamen bleiben im Original.
- Timestamps in "## Behauptungen" sind optional.
- Links auf Vault-Artikel sind erlaubt und erwuenscht; ihre technische
  Korrektheit wird getrennt gemessen und ist NICHT dein Gegenstand.

## Dein Auftrag

Miss beide Fassungen einzeln gegen das Transkript. Frageform ist Plural: nenne
alle Fundstellen, und sag ausdruecklich, wenn es nur eine oder keine gibt.

1. **Nicht gedeckte Aussagen.** Jede Aussage, die so nicht im Transkript steht —
   erfundene Zahl, erfundener Name, verdrehte Aussage, hinzugedichteter
   Zusammenhang. Je Fund: Fassung, Sektion, das Zitat aus der Fassung, und
   warum das Transkript es nicht deckt. Zaehl am Ende je Fassung.
2. **Eigene Spekulation des Modells.** Deutungen, Schluesse, Vorausschau, die
   der Sprecher nicht selbst zieht. Je Fund: Fassung, Zitat. Zaehl je Fassung.
3. **Fehlende wichtige Inhalte.** Geh das Transkript durch und nenne die Punkte,
   die ein Leser der Zusammenfassung braucht und die in einer der beiden
   Fassungen fehlen. Je Fund: welcher Punkt, in welcher Fassung er fehlt, wo er
   im Transkript steht. Zaehl je Fassung.
4. **Praezision der uebernommenen Aussagen.** Wo sagt eine Fassung dasselbe
   praeziser oder korrekter als die andere? Je Fund beide Formulierungen
   nebeneinander.
5. **Regelverstoesse gegen die Sektionsvorgaben** (fehlende Sektion, Sektion
   trotz fehlendem Anlass, Vorrede, fremde Ueberschrift, falsche Sprache).
6. **Gesamturteil je Kriterium** (Treue, Vollstaendigkeit, Praezision,
   Regeltreue): A besser / B besser / gleichwertig, mit einem Satz Begruendung.
   Kein Gesamtsieger-Satz ohne diese vier Einzelurteile.

Auflagen:

- Belege jeden Fund am Transkript. Findest du die Stelle nicht, schreib
  "im Transkript nicht gefunden" statt einer Vermutung.
- Zaehl nicht die Laenge als Qualitaet. Eine kuerzere Fassung ist nur dann
  schlechter, wenn ein benannter Inhalt fehlt.
- Bewerte die technische Form der Links NICHT.
- Rate nicht, welches Modell welche Fassung geschrieben hat.

## Ausgabe

Gib den Bericht als deine Schlussnachricht zurueck, in dieser Form:

    ## Nicht gedeckte Aussagen
    ### Fassung A
    - ...
    ### Fassung B
    - ...
    Zaehlung: A=<n> B=<n>

    ## Eigene Spekulation
    ... (gleiche Form, mit Zaehlung)

    ## Fehlende wichtige Inhalte
    ... (gleiche Form, mit Zaehlung)

    ## Praezision
    - ...

    ## Regelverstoesse
    ### Fassung A
    - ...
    ### Fassung B
    - ...

    ## Urteil
    - Treue: A besser | B besser | gleichwertig — <ein Satz>
    - Vollstaendigkeit: ...
    - Praezision: ...
    - Regeltreue: ...

---

# Transkript (audited_md)

${transkript}

---

# Fassung A

${grokIstA ? grok : opus}

---

# Fassung B

${grokIstA ? opus : grok}
`

  writeFileSync(join(RUN_DIR, "judge", `${meta.youtubeId}.prompt.md`), text, "utf-8")
  console.log(`${meta.youtubeId}\tA=${zuordnung[meta.youtubeId]!.A}\t${text.length} B`)
}

writeFileSync(
  join(RUN_DIR, "judge", "_zuordnung.json"),
  JSON.stringify(zuordnung, null, 2),
  "utf-8",
)
process.exit(0)
