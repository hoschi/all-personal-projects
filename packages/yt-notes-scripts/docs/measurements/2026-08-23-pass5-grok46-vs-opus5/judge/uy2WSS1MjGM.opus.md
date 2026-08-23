## Nicht gedeckte Aussagen

Vorbemerkung: Die Beschreibungstexte in "## Verwandt" beziehen sich auf Vault-Artikel, nicht auf das Transkript. Sie werden hier nicht als nicht gedeckte Aussagen gezaehlt (beide Fassungen haben solche Texte).

### Fassung A

- Sektion "Genannte Tools": "Neon — Postgres-Partner zur Integration im Generator." Das Transkript nennt Neon nur als Partner ("You can integrate with a lot of our partners like Neon and Netlify", 10:57). Dass Neon ein Postgres-Anbieter ist, sagt der Sprecher nirgends; Postgres faellt an anderer Stelle (8:10 CRUD, 9:39 Adapter) und ohne Bezug zu Neon.
- Grenzwertig — Sektion "Besprochene Konzepte": "React Query / TanStack Query — Daten-Fetching-Library, die das fehleranfaellige Selbst-Verwalten von Server-State abnimmt." Der Sprecher sagt zu React Query nur, es helfe gegen "useEffect with fetch" (1:37) und man mache damit Fetches bzw. Mutationen (2:07). Der Satz "you have to manage all that yourself" faellt im CRUD-Abschnitt (8:10) und betrifft nicht React Query. "Server-State" kommt im Transkript nicht vor.

Zaehlung: A=2 (davon 1 grenzwertig)

### Fassung B

- Sektion "Worum es geht": "Konferenz-Talk auf CascadiaJS". Das Transkript nennt nur "Cascadia" ("I was going to make a confession at Cascadia", 14:38). Das Suffix "JS" steht nicht im Transkript.
- Sektion "Besprochene Konzepte", Server Functions bzw. Behauptung zu 20:14: "Validatoren, Context und Middleware gebe es an API-Routen, Server Functions und normalen Routen." Das Transkript ordnet die drei Orte ausdruecklich nur der Middleware zu: "You can add middleware at any point on any API route, on any server function, on any regular route." Validator und Context werden davor genannt, aber ohne diese Ortsliste.
- Sektion "Genannte Tools": "[[Tailwind]] — Default-Styling im Scaffold". Der Sprecher waehlt Tailwind aktiv aus ("we'll use Tailwind because we're not crazy. There are toolchain options", 10:57). Dass es die Voreinstellung ist, steht nicht im Transkript.
- Grenzwertig — Sektion "Worum es geht": "Jason (YouTuber, TanStack-Core-Contributor)". Im Transkript faellt der Name "Jason" nur in der Anmoderation ("Give a big hand of applause, Jason", 0:00). Dass der Sprecher selbst so heisst, ist eine naheliegende, aber erschlossene Zuordnung — der Sprecher stellt sich nie mit Namen vor.

Zaehlung: B=4 (davon 1 grenzwertig)

## Eigene Spekulation

### Fassung A

- Keine gefunden. A markiert die Spekulation des Sprechers zweimal ausdruecklich ("laut Sprecher genau das, was man nicht tun soll"; "laut Sprecher ist TanStack Start das ideale Migrationsziel").

### Fassung B

- Grenzwertig — Sektion "Behauptungen": "Educators koennten CRA-Material mit 'Start' weiterverwenden." Die Stelle im Transkript ist verstuemmelt: "educators like Kent and I who have lots of videos using create react app can basically just say, well, just, you know, kind of copy and paste create React in there and just put in start and you're good to go" (10:57). B loest die unklare Stelle zu einer klaren Aussage auf; das ist eine Deutung des Modells, kein Zitat. Der Kern ("Educators", "start") ist woertlich vorhanden, deshalb nur grenzwertig.

Zaehlung: A=0 B=1 (grenzwertig)

## Fehlende wichtige Inhalte

### Fassung A

- Aufruf zur Mithilfe an der Dokumentation: "Actually, our documentation could use a lot of work. So if you are into that sort of thing, big kudos if you would help with that" (10:57). Fehlt in A, in B als Behauptung vorhanden.
- Release-Naehe von TanStack Start: "And we are so close to release" (14:38). Fehlt in A, in B vorhanden.
- Handlungsaufruf am Schluss: "try it out today over at tanstack.com" (25:12). Fehlt in A, in B vorhanden.
- Begruendung fuer den ProNext.js-Kurs: "I've worked in enterprise context. When I was at Walmart, HP, I know these folks are going to be like, 'Oh, pages router's dying. Let's go to the app router regardless of what anybody says.'" (14:38). A nennt nur die Existenz des Kurses, nicht den Grund. In B vorhanden.
- Die Matrix aus 16:31: Content-Sites, E-Commerce und Web-Applications, bei denen Pages Router, Remix oder Start "nicht falsch" waeren, der App Router aber nicht passe. A verkuerzt auf "kaum gute Einsatzfaelle" ohne die drei Kategorien. In B vorhanden.
- File-based Routing im Detail: Dot-Notation oder Ordner, und die Routing-Engine ist austauschbar ("You can even go and make your own. You can literally change out that engine", 18:11). Fehlt in A, in B vorhanden.
- Fertige Adapter ab Werk: "There's adapters that we get out of the box that go to Postgres and they manage all of that connection for you" (9:39). A sagt nur "austauschbare Backend-Adapter". In B vorhanden.
- Die Boilerplate-Option des Generators: "or you can just select to do none of that and get a really nice boilerplate that you can just start with and go" (24:02). Fehlt in A, in B als Demo-Schritt 6 vorhanden.
- Empfehlung von TanStack als OSS-Einstieg: "if you want to get into OSS, Tanstack is a fantastic place to be" (0:51). Fehlt in A, in B als erste Behauptung vorhanden.

### Fassung B

- Der Zweck des TanStack-Chat-Systems in der Demo: "this is really cool because it's going to show you some AI features" (10:57). B nennt nur "TanStack-Chat mit Netlify", nicht wofuer es steht. In A vorhanden.
- Der erste der beiden CRUD-Nachteile: "one, you have to manage all that yourself" (8:10). B nennt nur die fehlende Benachrichtigung anderer Clients. In A vorhanden.

### In beiden Fassungen fehlend

- Die Herkunft des Design-System-Problems: "I used to work at Nike and Walmart. I was the architect over there and so I would deal with all those forms" (6:51). In keiner Fassung.
- Das E-Commerce-Beispiel fuer SSR pro Route (Homepage, PDP, Suche mit SSR true; Cart und Checkout mit SSR false oder data-only) und der Punkt "all of your app logic is in one app as opposed to having lots of little mini apps" (19:03). In keiner Fassung.
- Zweck der Validatoren und Entwicklungsdauer: "you make sure that nobody's going to spam your server functions" und "This has been multiple years in the development" (20:14). In keiner Fassung.
- Verweis auf das eigene Video zu TanStack DB: "if you're really into this, go check out my video on it" (9:39). In keiner Fassung.

Zaehlung: A=13 (9 eigene + 4 gemeinsame) B=6 (2 eigene + 4 gemeinsame)

## Praezision

- Komponentenname der Composability-Schicht. Transkript 6:51: "in this case like this field.TextField that are standardized". B: "zu Komponenten wie `field.TextField`, die ueberall gleich mitwandern". A: "fuegt Validierungslogik und Design-System zu Komponenten zusammen". B nennt den Bezeichner, A nicht — B praeziser.
- Loader-API. Transkript 18:11: "you can just call to get your data and then get the use loader data off the route". B: "Daten im Loader laden, `useLoaderData` an der Route, typsicher". A: "Daten ueber Loader (am Remix-Modell orientiert)". B praeziser.
- Bedingung fuer die AI-Empfehlung in der Demo. Transkript 24:02: "if you give us a key or if you put in environment local". B: "Mit gesetztem Key bzw. `environment local`". A: "mit hinterlegtem API-Key". B praeziser (A laesst die zweite Variante weg und fuegt "API-" hinzu).
- Zod-Ereignisvalidierung. Transkript 5:24: "I can use it as my validator for my fields down there when I do the onBlur. You can do different types of event validation." B: "fuer Form, Server-Payload und onBlur-Validierung". A: "laesst sich dasselbe Schema auch zur Server-seitigen Validierung wiederverwenden". B praeziser.
- Neon. Transkript 10:57: "You can integrate with a lot of our partners like Neon and Netlify." B: "Neon — Partner-Integration im Scaffold". A: "Neon — Postgres-Partner zur Integration im Generator". B praeziser, A fuegt eine nicht gedeckte Eigenschaft hinzu.
- Zuordnung der Server-Function-Zusaetze. Transkript 20:14 nennt die Ortsliste nur fuer Middleware. A: "Input-Validatoren und Middleware an jeder Route" bzw. "pro Server Function die HTTP-Methode definieren sowie Validatoren, Context und Middleware ergaenzen". B: "Validatoren, Context und Middleware gebe es an API-Routen, Server Functions und normalen Routen". A praeziser.
- Status des Pages Router. Transkript 14:38: "pages router is deprecated because they released the app router". A: "Pages Router ist deprecated". B: "Pages Router sei durch den App Router de facto abgeloest". A woertlicher und damit praeziser; "de facto" schwaecht eine ausdrueckliche Aussage ab.
- Name der Konferenz. Transkript 14:38: "at Cascadia". A: "(Cascadia)". B: "auf CascadiaJS". A praeziser.
- Router im Scaffold. Transkript 10:57: "we automatically have React Router in there". A: "bringt aber automatisch React Router mit". B: "mit Router an Bord". A praeziser (B laesst offen, welcher Router gemeint ist).
- Verhaeltnis tRPC/ORPC. Transkript 2:07: "they don't agree on everything but they at least agree on using Tanstack Query." B: "tRPC und ORPC seien sich uneins, einigten sich aber auf TanStack Query als Kern". A: "React Query steht im Kern sowohl von tRPC als auch von oRPC". B gibt den Kontrast wieder, verallgemeinert "don't agree on everything" aber zu "seien sich uneins"; A laesst den Kontrast weg, bleibt bei dem, was es sagt. Kein klarer Vorsprung.

## Regelverstoesse

### Fassung A

- Keine. Alle sechs Sektionen sind vorhanden und in der vorgegebenen Reihenfolge; "Demos / Schritte" und "Genannte Tools" haben Anlass (Live-Demo ab 10:57, zahlreiche Tools). "Worum es geht" ist ein Satz. Keine Vorrede, keine fremden Ueberschriften, Sprache deutsch mit erhaltenen Fachbegriffen. Timestamps sind gesetzt, was zulaessig ist.

### Fassung B

- Keine. Gleiche Pruefung, gleiches Ergebnis: Reihenfolge vollstaendig, beide bedingten Sektionen haben Anlass, "Worum es geht" ein Satz, keine Vorrede, keine fremden Ueberschriften, Sprache deutsch. Die knappe Timestamp-Form "(2:07)" ohne Link ist zulaessig, weil Timestamps optional sind und keine Form vorgeschrieben ist. Dass zwischen Ueberschrift und Inhalt keine Leerzeile steht, ist keine der genannten Vorgaben.

## Urteil

- Treue: A besser — A hat zwei nicht gedeckte Zusaetze (davon einer grenzwertig) und keine eigene Deutung, B hat vier (davon einer grenzwertig) plus eine grenzwertige Deutung einer verstuemmelten Transkriptstelle.
- Vollstaendigkeit: B besser — neun im Transkript benannte Punkte fehlen nur in A (Doku-Aufruf, Release-Naehe, tanstack.com, Kursbegruendung, Eignungsmatrix, Routing-Details, Postgres-Adapter, Boilerplate-Option, OSS-Empfehlung), waehrend B nur zwei eigene Luecken hat.
- Praezision: gleichwertig — B nennt mehr konkrete Bezeichner aus dem Transkript (`field.TextField`, `useLoaderData`, `environment local`, onBlur), A vermeidet dafuer vier Ungenauigkeiten bei Zuschreibungen (Server-Function-Zusaetze, "deprecated", Cascadia, React Router im Scaffold).
- Regeltreue: gleichwertig — beide Fassungen erfuellen Sektionsfolge, Anlassbedingungen, Kuerze der Einleitung und Sprachvorgabe ohne Befund.

Zusammengefasst: B deckt den Talk deutlich vollstaendiger ab und nennt mehr konkrete Bezeichner, A bleibt dafuer naeher am Gesagten und fuegt weniger hinzu.
