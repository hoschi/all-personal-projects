## Nicht gedeckte Aussagen

### Fassung A

- Sektion "Besprochene Konzepte" bzw. "Genannte Tools": „[[MCP]] — Model Context Protocol als Node-Typ zum Anbinden externer Tools" bzw. „[[MCP]] — Model Context Protocol als verfügbarer Node-/Tool-Typ". Das Transkript nennt ausschliesslich „MCPs" als Node- und Tool-Eintrag („You also have file search, guardrails, MCPs", „you can use like a client tool, MCPs, file search"). Weder die Auflösung „Model Context Protocol" noch der Zweck „zum Anbinden externer Tools" steht dort. Beigetragenes Weltwissen. (Zwei Fundstellen, derselbe Zusatz — als ein Fund gezählt.)
- Sektion "Genannte Tools": „LangGraph — als vergleichbares Agenten-Framework genannt". Das Transkript ordnet LangGraph nur dem „agentic no code space" zu („their answer to tools like n8n, Vector Shift as well as LangGraph"). Die Einordnung als „Agenten-Framework" kommt nicht vor.
- Sektion "Behauptungen": „Nach der Konfiguration kann man den Agenten publishen oder per Code (ChatKit / Agent SDK) in einer Produktionsumgebung nutzen". Verdrehter Zusammenhang: im Transkript sind das zwei getrennte Punkte. Erst „you can access the code for the chat kit as well as the agent SDK and then you can also add a domain to this", danach als eigenständige Alternative „you can then publish your AI agent so that anyone can access it or you can basically access it in a production environment". Die Produktionsumgebung haengt dort nicht am Code-Zugriff.
- Sektion "Verwandt": „fasst denselben OpenAI-Dev-Day-AgentKit-Launch zusammen". Ein Dev Day wird im Transkript an keiner Stelle erwaehnt; die Zuordnung des Videos zu diesem Anlass ist hinzugefuegt.

### Fassung B

- Sektion "Genannte Tools": „LangGraph — vom Sprecher als Vergleichsprodukt im agentischen No-Code-/Orchestrierungsraum genannt". „agentic no code space" steht woertlich im Transkript, „Orchestrierung" nicht. Geringfuegiger Zusatz, aber nicht gedeckt.

Zaehlung: A=4 B=1

## Eigene Spekulation

### Fassung A

- Keine. Die einzige Vorausschau im Text („Der Sprecher vermutet, dass Agent Kit künftig weiterentwickelt wird und n8n möglicherweise irgendwann ebenbürtig sein könnte") ist Spekulation des Sprechers und korrekt als solche markiert; das Transkript sagt „it will be able to maybe even be on par with n8n in the future". Die oben unter "Nicht gedeckte Aussagen" gelisteten Zusaetze sind beigetragenes Sachwissen, keine Deutung.

### Fassung B

- Keine. Die Vorausschau („Der Sprecher vermutet, dass Agent Kit künftig mit n8n gleichziehen könnte") ist dem Sprecher zugeschrieben, ebenso die Dokumentenmenge („Der Datenbank-Agent kann laut Sprecher auch große Mengen von Dokumenten verarbeiten" ← „this is something that can also process large amounts of documents").

Zaehlung: A=0 B=0

## Fehlende wichtige Inhalte

### Fassung A

- Die Schlussfolgerung des Sprechers zum HubSpot-Beispiel fehlt: „This shows how Agent Kit isn't just for devs. It's designed for real businesses so that you can embed agentic logic into customer experiences without building everything from scratch." A nennt nur das Widget und die Wissensdatenbank. (Transkript, Abschnitt „Agent Builder — Canvas, Nodes & Konfiguration", zweiter Absatz.) In B enthalten.
- Der Zweck der Web-Recherche fehlt: „find information about the following company that could be used in marketing assets". A schreibt nur „Websuche nach Firmeninfos". (Abschnitt „Demo: Unternehmens-Recherche-Workflow", erster Absatz.) In B enthalten.
- „it also has been requested to include chat history" beim zweiten Agenten fehlt bei A. (Gleicher Absatz.) In B enthalten.
- Im Datenbank-Demo fehlt der Zwischenschritt „It'll then identify each category and then it will provide you a summary of it". (Abschnitt „Demo: Datenbank-Abfrage-Workflow".) In B enthalten.
- Ebenfalls fehlt „And this is something that can also process large amounts of documents which is great". (Gleicher Abschnitt.) In B enthalten.
- Die Begruendung, warum Agent Kit n8n noch nicht ueberlegen ist, fehlt: „This is because agent kit is definitely fairly new. There's a lot of factors that are still being implemented." A stellt nur das Urteil fest. (Abschnitt „Agent Kit vs. n8n".) In B teilweise enthalten („weil es noch sehr neu ist").
- „powered by state-of-the-art models" fehlt bei A. (Gleicher Abschnitt.) In B enthalten („mit aktuellen Modellen").
- Beim Agent-Node fehlt das „client tool" als eines der wählbaren Tools; A schreibt pauschal „Tools". (Abschnitt „Agent Builder — Canvas, Nodes & Konfiguration", dritter Absatz.) In B enthalten.
- Die Relativierung des Demos fehlt: „And this was a super simple AI agent that anyone can create with most AI agent builders." Sie ordnet die Vorfuehrung ein und fehlt in beiden Fassungen. (Abschnitt „Demo: Unternehmens-Recherche-Workflow", zweiter Absatz.)
- „alternatively you can convert the results into different structures" fehlt. Fehlt in beiden Fassungen. (Gleicher Abschnitt, erster Absatz.)

### Fassung B

- Die Wertung des Sprechers zur Modellbindung fehlt: „which is definitely restrictive if you're looking to use other models like Gemini or Claude". B nennt nur die Tatsache („Gemini- und Claude-Modelle sind nicht wählbar"), nicht das Urteil des Sprechers. (Abschnitt „Agent Builder — Canvas, Nodes & Konfiguration", dritter Absatz.) In A enthalten.
- „And this was a super simple AI agent that anyone can create with most AI agent builders" fehlt (gleicher Fund wie bei A, fehlt in beiden Fassungen).
- „alternatively you can convert the results into different structures" fehlt (gleicher Fund wie bei A, fehlt in beiden Fassungen).

Zaehlung: A=10 B=3

## Praezision

- Modellbindung: A „Die Modellauswahl ist auf das OpenAI-Ökosystem beschränkt — andere Modelle wie Gemini oder Claude sind nicht nutzbar, was der Sprecher als einschränkend bezeichnet" gegen B „Modellwahl nur im OpenAI-Ökosystem — Gemini- und Claude-Modelle sind nicht wählbar". A ist praeziser: es haelt die Wertung „definitely restrictive" fest und schreibt sie dem Sprecher zu.
- Auftrag des Recherche-Agenten: B „Web-Research-Agent (Web Search, Marketing-Infos zur Firma)" gegen A „Web-Research-Agent (Websuche nach Firmeninfos)". B ist praeziser, weil das Transkript den Verwendungszweck („used in marketing assets") ausdruecklich nennt.
- Ausgabe der Nvidia-Preview: B „Industrie (Semiconductors and Technology)" gegen A „Branche (Halbleiter/Technologie)". B gibt die Ausgabe im Original wieder, A uebersetzt sie.
- MCP: B „MCP — Node- und Tool-Typ im Agent Builder" gegen A „[[MCP]] — Model Context Protocol als Node-Typ zum Anbinden externer Tools". B bleibt exakt im Transkript, A ergaenzt Nichtgesagtes.
- Datenbank-Ablauf: B „Guardrail prüft die Eingabe auf Moderation, danach Kategorie erkennen und Select-Agent ausführen" gegen A „Agent fragt eine Datenbank ab, mit Guardrail-Moderation der Eingabe; ... Select-Agent liefert nach Guardrail-Check das Ergebnis". B bildet die Schrittfolge vollstaendiger ab (Kategorie-Erkennung).
- Abschluss der Konfiguration: B „evaluieren, duplizieren, Chat-Kit- und Agent-SDK-Code holen, eine Domain zuweisen und veröffentlichen" gegen A „publishen oder per Code (ChatKit / Agent SDK) in einer Produktionsumgebung nutzen". B haelt die Aufzaehlung des Transkripts als Reihe, A verknuepft zwei getrennte Punkte kausal.
- n8n-Urteil: B „Agent Kit ist n8n noch nicht überlegen, weil es noch sehr neu ist" gegen A „Laut Sprecher ist Agent Kit aktuell nicht überlegen gegenüber n8n". B nennt die vom Sprecher gegebene Begruendung mit.
- Bestellzahl: A „ca. 82.000 Bestellungen aus Dummy-Daten" gegen B „ca. 82k Orders auf Basis der Dummy-Daten". Gleichwertig; beide decken „the total orders is 82k approximately based off of the dummy data".

## Regelverstoesse

### Fassung A

- Keine. Sektionen stehen in der vorgegebenen Reihenfolge und Auswahl ("Demos / Schritte" und "Genannte Tools" sind durch die zwei Vorfuehrungen und die genannten Produkte gedeckt), "Worum es geht" hat zwei Saetze, keine Vorrede, keine fremde Ueberschrift, Sprache deutsch.
- Grenzfall, kein Verstoss: „Branche (Halbleiter/Technologie)" uebersetzt eine im Video gezeigte Ausgabe, die B im Original belaesst. Ein Produkt- oder Befehlsname ist es nicht, deshalb faellt es nicht unter die Original-Regel — es steht oben unter "Praezision".

### Fassung B

- Keine. Sektionen in Reihenfolge und Auswahl korrekt, "Worum es geht" zwei Saetze, keine Vorrede, keine fremde Ueberschrift, Sprache deutsch. Dass B keine Leerzeile zwischen Ueberschrift und Text setzt, ist Formatierung und von den Sektionsvorgaben nicht erfasst.

## Urteil

- Treue: B besser — A traegt vier nicht gedeckte Zusaetze bei (MCP-Auflösung, LangGraph-Einordnung, verknuepfter Publish-/Produktionspfad, Dev-Day-Zuordnung), B einen geringfuegigen.
- Vollstaendigkeit: B besser — zehn benannte Luecken bei A gegen drei bei B, davon zwei in beiden Fassungen gleich; B deckt saemtliche bei A fehlenden Punkte ab.
- Praezision: B besser — von sieben unterscheidbaren Gegenueberstellungen faellt eine zugunsten von A (Wertung „restrictive") und sechs zugunsten von B.
- Regeltreue: gleichwertig — beide Fassungen halten Sektionsreihenfolge, Sektionsanlaesse, Satzgrenze und Sprache ein, keine Verstoesse auf beiden Seiten.
