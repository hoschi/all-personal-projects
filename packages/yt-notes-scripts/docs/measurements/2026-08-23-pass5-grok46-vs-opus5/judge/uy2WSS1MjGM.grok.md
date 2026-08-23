## Nicht gedeckte Aussagen
### Fassung A
- **Besprochene Konzepte** (und nochmals **Genannte Tools**): „Daten-Fetching-Library, die das fehleranfällige Selbst-Verwalten von Server-State abnimmt“ bzw. „Library für Daten-Fetching und Server-State“ (`/tmp/claude/p5/j-uy2WSS1MjGM.md:277`, `:331`). Der Sprecher sagt, Cloudflare habe `useEffect` mit `fetch` genutzt und genau das wolle man nicht; React Query helfe dagegen (`:112`). „Server-State“ und „fehleranfällig“: im Transkript nicht gefunden.
- **Demos / Schritte** 4–5: MCP-Handler sowie Partner Neon/Netlify als ausgeführte Schritte, oRPC/TRPC als Demo-Option (`:321–324`). Im Transkript: DB und Form werden angewählt, Chat wird geholt; MCP und Neon/Netlify nur als „you can“; ORPC/TRPC ausdrücklich nicht: „we'll just leave it at that“ (`:179–181`).
### Fassung B
- **Worum es geht:** „Konferenz-Talk auf CascadiaJS“ (`:367`). Sprecher: „confession at Cascadia“ (`:197`). „CascadiaJS“: im Transkript nicht gefunden.
- **Genannte Tools:** Tailwind als „Default-Styling im Scaffold“ (`:439`). Sprecher: „we'll use Tailwind because we're not crazy. There are toolchain options.“ (`:179`). „Default“: im Transkript nicht gefunden.
Zaehlung: A=2 B=2
## Eigene Spekulation
### Fassung A
- **Verwandt:** „Theo-Video mit derselben Argumentation für eine SPA-zentrierte Architektur statt Next.js“ (`:355`). Der Sprecher erwähnt Theo nicht und zieht diesen Vergleich nicht.
### Fassung B
- keine Fundstellen
Zaehlung: A=1 B=0
## Fehlende wichtige Inhalte
### Fassung A
- Doku brauche viel Arbeit, Hilfe erwünscht — fehlt in A, steht in B; Transkript `:177` (10:57).
- Educators mit CRA-Videos sollen „Start“ einsetzen — fehlt in A, steht in B; `:177` (10:57).
- TanStack Start sei nah am Release — fehlt in A, steht in B; `:193` (14:38).
- ProNext.js: gleicher Publishing-Ort wie Kent; Enterprise (Walmart, HP) gehe trotz Kritik auf den App Router — in A nur Kursname/Joel Hooks/Flight-Daten; `:197` (14:38).
- Einsatzmatrix: Content-Sites, E-Commerce, Web-Apps; Pages Router / Remix / Start passen, App Router nicht — in A nur „kaum gute Einsatzfälle“; `:201` (16:31).
- File-based Routing: Dot-Notation (`API.`), Ordner, Engine austauschbar — fehlt in A, steht in B; `:215` (18:11).
- `useLoaderData` an der Route, typsicher — fehlt in A, steht in B; `:215` (18:11).
- Shop-Beispiel für SSR pro Route (Homepage/PDP/Search an, Cart/Checkout `ssr: false` oder data-only) — fehlt in A und B; `:223` (19:03).
- Eine App statt vieler Mini-Apps (Vite-SPAs neben Next.js) — fehlt in A und B; `:223` (19:03).
- Jede Library hat Demos; ohne Zusätze bleibt ein Boilerplate — fehlt in A, steht in B; `:255` (24:02).
- CTA: ausprobieren auf tanstack.com — fehlt in A, steht in B; `:259` (25:12).
### Fassung B
- Async-Validierung am API-Beispiel „ship to this person at this address“ — fehlt in B (nur sync/async genannt), in A als „Adressprüfung“; `:139` (5:24).
- Shop-Beispiel für SSR pro Route — fehlt in A und B; `:223` (19:03).
- Eine App statt Mini-Apps — fehlt in A und B; `:223` (19:03).
Zaehlung: A=11 B=3
## Praezision
- Konferenzname: A „Cascadia“ (`:272`) vs. B „CascadiaJS“ (`:367`) — A deckt `:197` wortnäher.
- tRPC/ORPC: A „steht im Kern sowohl von tRPC als auch von oRPC“ (`:291`) vs. B „seien sich uneins, einigten sich aber auf TanStack Query“ (`:388`) — B deckt „they don't agree on everything but they at least agree on using Tanstack Query“ (`:117`).
- Form-API: A „ändert man das Textfeld“ (`:297`) vs. B „Komponenten wie `field.TextField`“ (`:395`) — B näher an `:149`.
- MUI: A „massive MUI-Controls“ / „500-Zeilen-Monster“ (`:298`) vs. B zusätzlich „30-Zeilen-Controls“ (`:431`) — B nimmt „30 lines“ (`:147`) mit; 500 Zeilen haben beide.
- Zod/Events: A Schema für Server-Validierung (`:296`) vs. B Form, Server-Payload und onBlur (`:393`) — B näher an `:143`.
- Async-Beispiel: A „z. B. Adressprüfung“ (`:279`) vs. B ohne Liefer-API — A näher an `:139`.
- Loader: A „Daten über Loader“ (`:284`) vs. B „`useLoaderData` an der Route“ (`:381`) — B näher an `:215`.
- Per-route SSR: A „SSR pro Route abschaltbar“ (`:285`) vs. B „`ssr: false` pro Route“ (`:382`) — B näher an „SSR false“ (`:223`).
- Middleware: A „Validatoren, Context und Middleware ergänzen“ (`:313`) vs. B „an API-Routen, Server Functions und normalen Routen“ (`:411`) — B näher an `:227`.
- JPEG-Env: A „(vermeintlichen) JPEG-Datei“ (`:315`) vs. B „wie JPEG aussehe, aber keine sei“ (`:413`) — B näher an „a JPEG file, but not really a JPEG file“ (`:245`).
- Generator-Optionen: A nummeriert MCP/Neon/Netlify als Schritte (`:321–324`) vs. B „optional“ (`:418`) — B näher an `:179–181`; A detaillierter in der Reihenfolge, aber zu fest als Ausführung.
- Remix v3: A „Remix v3 unbekannt“ (`:307`) vs. B „Remix v3 kennen er und Kent nicht“ plus Pages vs. App Router (`:404`) — B näher an `:195`.
## Regelverstoesse
### Fassung A
- keine Fundstellen (Reihenfolge Worum → Konzepte → Behauptungen → Demos → Tools → Verwandt; Worum ein Satz; Demos und Tools mit Anlass; Deutsch; keine Vorrede, keine fremde Überschrift).
### Fassung B
- keine Fundstellen (dieselbe Sektionsfolge und dieselben Anlässe; Worum ein Satz; Deutsch; keine Vorrede, keine fremde Überschrift).
## Urteil
- Treue: B besser — beide haben zwei ungedeckte Stellen; bei A sind es ein untergeschobenes RQ-Konzept und als ausgeführt verkaufte CLI-Optionen, bei B Namensergänzung und ein falsches „Default“.
- Vollstaendigkeit: B besser — A lässt Release-Nähe, App-Router-Matrix, CRA→Start, Routing-API und die CTAs weg; B fehlen vor allem zwei gemeinsame Architektur-Beispiele und das Liefer-API-Beispiel.
- Praezision: B besser — mehr wörtliche APIs, Flags und die tRPC-Uneinigkeit; A nur bei „Cascadia“ und der Adressprüfung enger am Transkript.
- Regeltreue: gleichwertig — beide erfüllen die Sektionsvorgaben ohne Vorrede oder falsche Sprache.
Annahme: Überschriften im `audited_md` (z. B. „anti-pattern“) sind redaktionell, nicht Sprechertext. Link-Technik in Verwandt/Tools nicht bewertet.
