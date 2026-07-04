export interface PrivatePromptInput {
  transcriptionText: string
  contextText: string
}

export interface WorkPromptInput {
  transcriptionText: string
  bottomTextContext: string
  ytContext: {
    displayTitle: string
    channelName: string
    descriptionShort: string
    namedEntities: string[]
  }
}

export function buildPrivatePrompt(input: PrivatePromptInput): string {
  const contextBlock =
    input.contextText.trim().length > 0 ? input.contextText : "(noch nichts)"
  return [
    "Du glättest Whisper-Diktate (Deutsch, Themen: KI, Software, Tools, YouTube-Notizen) zu lesbarem Text. Aktive Rolle: nicht nur Punkte setzen, sondern Grammatik, Satzbau und Eigennamen reparieren — ohne den Inhalt zu verändern.",
    "",
    "AKTIV ERLAUBT (und erwartet):",
    "- Lange Schachtelsätze an natürlichen Übergängen teilen (z.B. vor 'und dann', 'aber', 'weil').",
    "- Grammatik fixen: Genus ('die Prompt' → 'der Prompt'), Tempus ('war keinen Sinn gemacht' → 'hat keinen Sinn gemacht'), Subjekt-Verb-Kongruenz, Satzanschlüsse.",
    "- Whisper-Füllwörter streichen ('ähm', doppelte 'und und', halb-abgebrochene Satzanfänge).",
    "- Wörter ersetzen, wenn das Original im Kontext keinen Sinn ergibt ODER klar ein Whisper-Mishear ist (siehe Regel 5).",
    "",
    "REGELN — in dieser Reihenfolge anwenden:",
    "",
    '1. Diktier-Befehle als Wörter → Satzzeichen (NUR wenn das Wort isoliert zwischen normalen Satz-Bestandteilen steht; nicht z.B. "auf den Punkt kommen"):',
    "   Punkt → . | Komma → , | Doppelpunkt → : | Fragezeichen → ? | Ausrufezeichen → ! | Klammer auf → ( | Klammer zu → )",
    '   Beispiel: "hat Punkt dann kann" → "hat. Dann kann".',
    "",
    '2. "ki" als Akronym → "KI" (z.B. "ki-agent" → "KI-Agent", "mit ki" → "mit KI"). NICHT in Wikilinks/Code/URLs.',
    "",
    "3. Deutsche Substantive großschreiben:",
    "   kontext → Kontext, sprachmodell → Sprachmodell, wissensgraph → Wissensgraph, softwareentwicklung → Softwareentwicklung, kalendertermin → Kalendertermin.",
    "   Etablierte Anglizismen bleiben klein: workflow, template, prompt, framework, chunk.",
    "",
    '4. Satzanfang nach Punkt großschreiben: "funktioniert. wenn ich" → "funktioniert. Wenn ich".',
    "",
    "5. Phonetisch-ähnliche Korrekturen wenn ALLE drei Bedingungen erfüllt sind:",
    "   (a) das ursprüngliche Wort ergibt im Kontext keinen Sinn UND",
    "   (b) das Ersatzwort klingt phonetisch sehr ähnlich UND",
    "   (c) der Kontext stützt das Ersatzwort eindeutig.",
    '   Beispiele: terministisch → deterministisch, Jupiter → Jupyter, "im bettings" → Embeddings, "KV Cash" → "KV Cache", Looperzeugt → "Loop erzeugt", anpreißen → anpreisen, ephermal → ephemeral.',
    "   Wenn nur 2 von 3 Bedingungen erfüllt: NICHT ändern.",
    "",
    "VERBOTEN (Inhalt bleibt unangetastet):",
    "- Inhalte ergänzen, die der User nicht gesagt hat",
    "- Aussagen abschwächen, verstärken oder mit Bewertungen versehen",
    "- Diktierte Fakten, Zahlen oder Namen verändern",
    "- Wörter rein stilistisch tauschen (Synonym-Tausch ohne Fehler-Verdacht)",
    "- Englisch antworten (Output ist Deutsch)",
    "",
    "KONTEXT (was der User in der Notiz bereits geschrieben hat):",
    contextBlock,
    "",
    "ZU KORRIGIERENDER TEXT (Whisper-Output):",
    input.transcriptionText,
    "",
    "Gib NUR den korrigierten Text aus, ohne Vor- oder Nachwort, ohne Erklärung.",
  ].join("\n")
}

export function buildWorkPrompt(input: WorkPromptInput): string {
  const bottomContext =
    input.bottomTextContext.trim().length > 0
      ? input.bottomTextContext
      : "(noch nichts)"
  const entitiesList =
    input.ytContext.namedEntities.map((e) => `- ${e}`).join("\n") || "(keine)"

  return [
    "Du glättest Whisper-Diktate (Deutsch, Themen: KI, Software, Tools, YouTube-Notizen zu Fachvideos) zu lesbarem Text. Aktive Rolle: nicht nur Punkte setzen, sondern Grammatik, Satzbau und Eigennamen reparieren — ohne den Inhalt zu verändern.",
    "",
    "AKTIV ERLAUBT (und erwartet):",
    "- Lange Schachtelsätze an natürlichen Übergängen teilen (z.B. vor 'und dann', 'aber', 'weil').",
    "- Grammatik fixen: Genus ('die Prompt' → 'der Prompt'), Tempus ('war keinen Sinn gemacht' → 'hat keinen Sinn gemacht'), Subjekt-Verb-Kongruenz, Satzanschlüsse.",
    "- Whisper-Füllwörter streichen ('ähm', doppelte 'und und', halb-abgebrochene Satzanfänge).",
    "- Wörter ersetzen, wenn das Original im Kontext keinen Sinn ergibt ODER klar ein Whisper-Mishear ist (siehe Regel 6).",
    "",
    "REGELN — in dieser Reihenfolge anwenden:",
    "",
    '1. Diktier-Befehle als Wörter → Satzzeichen (NUR wenn das Wort isoliert zwischen normalen Satz-Bestandteilen steht; nicht z.B. "auf den Punkt kommen"):',
    "   Punkt → . | Komma → , | Doppelpunkt → : | Fragezeichen → ? | Ausrufezeichen → !",
    "   | Klammer auf → ( | Klammer zu → )",
    '   Beispiel: "hat Punkt dann kann" → "hat. Dann kann".',
    "",
    '2. "ki" als Akronym → "KI" (z.B. "ki-agent" → "KI-Agent"). NICHT in Wikilinks/Code.',
    "",
    "3. EIGENNAMEN aus dem YT-KONTEXT (unten) haben Vorrang über generische Schreibweisen.",
    "   Tool-/Personen-/Marken-/Feature-Namen aus der Liste exakt so übernehmen — auch wenn das Wort isoliert generisch wirkt (z.B. 'handoff', 'compact', 'Skill' können im YT-Kontext konkrete Befehle/Features sein).",
    "",
    "4. Deutsche Substantive großschreiben (Kontext, Sprachmodell, Wissensgraph,",
    "   Kalendertermin etc.). Etablierte Anglizismen bleiben klein: workflow, template,",
    "   prompt, framework, chunk.",
    "",
    "5. Satzanfang nach Punkt großschreiben.",
    "",
    "6. Phonetisch-ähnliche Korrekturen wenn ALLE drei Bedingungen erfüllt sind:",
    "   (a) das ursprüngliche Wort ergibt im Kontext keinen Sinn UND",
    "   (b) das Ersatzwort klingt phonetisch sehr ähnlich UND",
    "   (c) der YT-Kontext stützt das Ersatzwort eindeutig.",
    '   Beispiele: terministisch → deterministisch, Jupiter → Jupyter, "im bettings" → Embeddings, "KV Cash" → "KV Cache", ephermal → ephemeral, "Hand-Off" → handoff (wenn YT-Entity-Liste "handoff" enthält).',
    "   Wenn nur 2 von 3 Bedingungen erfüllt: NICHT ändern.",
    "",
    "VERBOTEN (Inhalt bleibt unangetastet):",
    "- Inhalte ergänzen, die der User nicht gesagt hat",
    "- Aussagen abschwächen, verstärken oder mit Bewertungen versehen",
    "- Diktierte Fakten, Zahlen oder Namen verändern",
    "- Wörter rein stilistisch tauschen (Synonym-Tausch ohne Fehler-Verdacht)",
    "- Englisch antworten (Output ist Deutsch)",
    "",
    "═══════════════════════════════════════════════════════════════",
    "YT-KONTEXT — YouTube-Video, das gerade besprochen wird:",
    "═══════════════════════════════════════════════════════════════",
    "",
    `Video-Titel: ${input.ytContext.displayTitle}`,
    `Channel: ${input.ytContext.channelName}`,
    "",
    "Worum es geht (3 Sätze):",
    input.ytContext.descriptionShort,
    "",
    "Eigennamen im Video (vorrangig korrekt schreiben):",
    entitiesList,
    "",
    "═══════════════════════════════════════════════════════════════",
    "BISHERIGE ASR-NOTIZEN — was der User in der Notiz bereits geschrieben hat:",
    "═══════════════════════════════════════════════════════════════",
    "",
    bottomContext,
    "",
    "═══════════════════════════════════════════════════════════════",
    "ZU KORRIGIERENDER TEXT (Whisper-Output):",
    "═══════════════════════════════════════════════════════════════",
    "",
    input.transcriptionText,
    "",
    "Gib NUR den korrigierten Text aus, ohne Vor- oder Nachwort, ohne Erklärung.",
  ].join("\n")
}
