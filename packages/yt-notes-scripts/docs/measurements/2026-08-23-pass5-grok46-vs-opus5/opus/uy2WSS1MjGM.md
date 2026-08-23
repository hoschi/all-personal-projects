---
tags:
  - youtube
aliases:
  - "TanStack Start: React-Framework mit Router, Server Functions und
    Echtzeit-DB"
channelName: CascadiaJS
publish_date: 2025-10-04
display_title: "TanStack Start: React-Framework mit Router, Server Functions und Echtzeit-DB"
description: Der Sprecher, ein TanStack-Core-Contributor, stellt das
  TanStack-Ökosystem als Alternative zu Next.js und Remix vor. Gezeigt werden
  TanStack Query, Form (Zod-Validierung, Design-System-Composability), TanStack
  DB (Live-Collections, Adapter-Schicht), TanStack Router/Start (file-based
  Routing, Server Functions mit konfigurierbaren HTTP-Methoden, per-Route
  SSR-Kontrolle) sowie `create-tanstack-app` als CLI-Bootstrapper. Relevant für
  React-Entwickler, die von Next.js Pages Router oder Remix migrieren, oder SPAs
  mit BFF-Pattern und Typ-Sicherheit aufbauen wollen.
youtube_id: uy2WSS1MjGM
---

# TanStack is Your New Favorite Framework

## Worum es geht

Ein Konferenz-Talk (Cascadia), in dem ein TanStack-Core-Contributor das TanStack-Ökosystem vorstellt — von React Query über die neueren Libraries Form, DB, Router und Start — und am Ende `create-tanstack-app` samt Gitarren-Store-Demo live vorführt.

---

## Notizen

[URL](https://youtu.be/uy2WSS1MjGM?si=qtSkhKUqV6i6NHEP)

Interessant ist, dass er einen Kurs für Next.js App Router gemacht hat und nachdem er ein Jahr damit gearbeitet hat, sagen muss, dass das nicht gut funktioniert und er alle anderen Alternativen wesentlich besser empfehlen kann. Wichtig ist an der Stelle, dass das Video vor V16 aufgenommen wurde, wo mit Caching bei Next.js sich doch nochmal sehr viel geändert hat. Auch wird kurz darauf eingegangen, dass TanStack Start für SPAs, die APIs nutzen, sehr gut geeignet ist und einen guten Migrationspfad bietet.

---

## Besprochene Konzepte

- React Query / TanStack Query — Daten-Fetching-Library, die das fehleranfällige Selbst-Verwalten von Server-State abnimmt.
- "useEffect + fetch"-Anti-Pattern — direktes Fetchen im Effekt, laut Sprecher genau das, was man nicht tun soll.
- TanStack-Prinzipien — jede Library muss multi-framework-fähig, durchgehend type-safe und mit guter DX gebaut sein.
- Synchrone und asynchrone Validierung — Formularfelder können auch per API-Call (z. B. Adressprüfung) validiert werden.
- Composability-Layer — Verschmelzung von Validierungslogik mit dem Design-System zu standardisierten, zentral änderbaren Komponenten.
- CRUD vs. Real-time-DBs — Abgrenzung zwischen klassischem REST/Postgres-CRUD und Subscription-basierten Echtzeit-Stores.
- Adapter / Vendor-Neutralität — TanStack DB als austauschbare Schicht über beliebigen Datenquellen statt Lock-in an Firebase/Convex.
- SPA-first mit SSR/Hybrid — SPA als Basis, optional SSR und Server Functions/BFF in dieselbe App integriert.
- File-based Routing & Loaders — Routen aus Dateien, Daten über Loader (am Remix-Modell orientiert).
- SSR data-only & per-route SSR — Daten serverseitig laden, Render aber clientseitig; SSR pro Route abschaltbar.
- Server Functions mit Method/Validator/Middleware — frei wählbare HTTP-Methode, Input-Validatoren und Middleware an jeder Route.

## Behauptungen

- 30 % aller React-Anwendungen weltweit nutzen React Query ([2:07](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=127s)).
- React Query steht im Kern sowohl von tRPC als auch von oRPC ([2:07](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=127s)).
- Cloudflare hat auf dem eigenen Dashboard `useEffect` mit `fetch` verwendet — genau das, was React Query verhindern soll ([1:37](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=97s)).
- Tanner Lindsley ist gut in SEO, und der Name "TanStack" ist hervorragend für SEO ([2:48](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=168s)).
- Formulare richtig hinzubekommen ist mühsam; das Beste, was man erreichen kann, ist "nicht zu vermasseln" ([4:10](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=250s)).
- "Wenn du eine super schnelle Form-Library brauchst, hast du wahrscheinlich zu viele Felder im Formular" ([5:24](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=324s)).
- Definiert man das Formular mit Zod, lässt sich dasselbe Schema auch zur Server-seitigen Validierung wiederverwenden ([5:24](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=324s)).
- TanStack Form fügt Validierungslogik und Design-System zu Komponenten zusammen — ändert man das Textfeld, ändert es sich auf jedem Formular ([6:51](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=411s)).
- Mit Formik und React Hook Form werden Formulare durch große MUI-Controls schnell zu 500-Zeilen-Monstern ([6:51](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=411s)).
- Niemand mag klassisches CRUD ([8:10](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=490s)).
- Bei CRUD bekommen andere Web-Clients von Änderungen nichts mit, und man muss alles selbst verwalten ([8:10](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=490s)).
- Real-time-DBs sind großartig, binden einen aber an einen Vendor (Firebase- bzw. Convex-Code) ([9:39](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=579s)).
- TanStack DB ist kein ORM/Prisma-Ersatz, sondern ein neues State-Management- und Live-Query-System ([9:39](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=579s)).
- Das React-Team hat Create React App deprecated ([10:57](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=657s)).
- `create-tanstack-app` ist als gleichwertiger Ersatz gebaut, bringt aber automatisch React Router mit ([10:57](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=657s)).
- `create-tanstack-app` ist inzwischen die Hälfte des Vollzeit-OSS-Jobs des Sprechers ([10:57](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=657s)).
- TanStack Start lässt sich gut mit dem Next.js Pages Router und Remix v2 vergleichen ([14:38](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=878s)).
- Pages Router ist deprecated und Remix v3 unbekannt — laut Sprecher ist TanStack Start das ideale Migrationsziel für Full-Stack-Apps ([14:38](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=878s)).
- Der Sprecher hat einen kostenpflichtigen Kurs "ProNext.js" über den App Router, basierend auf Joel Hooks System ([14:38](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=878s)).
- App-Router-Seiten sind aufgebläht: aus 7K HTML werden durch zusätzliche Flight-Daten ~21K Seitengröße ([14:38](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=878s)).
- Der Sprecher sagt, er habe nach ein bis zwei Jahren Arbeit kaum gute Einsatzfälle für den App Router gefunden ([16:31](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=991s)).
- Tanner Lindsley ist überzeugter SPA-First-Verfechter ([17:24](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1044s)).
- Server Functions im App Router machen ausschließlich POST, was schwer zu cachen ist und ein CDN-/Performance-Problem darstellt ([20:14](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1214s)).
- In TanStack Start kann man pro Server Function die HTTP-Methode definieren sowie Validatoren, Context und Middleware ergänzen ([20:14](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1214s)).
- Cloudflare und Netlify sponsern TanStack; man kann aber überall deployen, da TanStack selbst kein Cloud-Provider ist ([22:02](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1322s)).
- Der Sprecher hat seine AI-Umgebungsvariable wegen Supply-Chain-Attacken in einer (vermeintlichen) JPEG-Datei statt im globalen Environment abgelegt ([22:52](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1372s)).
- Die App lässt sich im MCP-Mode in Cursor oder Visual Studio Code laufen lassen und integriert sich automatisch in deren AI ([25:32](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1532s)).

## Demos / Schritte

1. Terminal öffnen und `create-tanstack-app` starten.
2. Tailwind als Toolchain-Option auswählen.
3. DB und Form als Library-Optionen aktivieren.
4. MCP-Handler einbinden, damit die App automatisch zum MCP-Server werden kann.
5. Partner wie Neon und Netlify integrieren, optional oRPC/TRPC ergänzen.
6. Das gemeinsam mit Netlify gebaute TanStack-Chat-System mit AI-Features hinzufügen.
7. App mit `npm dev` starten und `localhost:3000` öffnen.
8. Den eingebauten Gitarren-Store ansehen: parameterisierte Routes und Index-Routes, AI-generierte Gitarren; mit hinterlegtem API-Key per Prompt ("please recommend a good guitar") eine Empfehlung erzeugen.

## Genannte Tools

- React Query / TanStack Query — Library für Daten-Fetching und Server-State (`useQuery`/`useMutation`).
- [tanstack-form-mit-start-und-query](obsidian://open?vault=knowledge-base&file=tanstack-form-mit-start-und-query) — TanStack Form, neue Formular-Library mit Sync/Async-Validierung und Composability.
- TanStack DB — Live-Collection-/Live-Query-System mit austauschbaren Backend-Adaptern.
- [[TanStack Start]] — Full-Stack-Framework mit SSR, Server Functions und File-based Routing auf SPA-Basis.
- TanStack Router — code-/file-basiertes Routing als TanStack-Variante von React Router.
- [[parsing-validating-typescript]] — Zod, zur Schema-Definition und Wiederverwendung für Form- und Server-Validierung.
- [[tRPC]] — typsichere Remote-Procedure-Calls, basierend auf TanStack Query.
- oRPC — OpenAPI-Variante typsicherer RPCs, ebenfalls auf TanStack Query aufbauend.
- [[Remix]] — Full-Stack-React-Framework, als Vergleichsgröße herangezogen.
- Next.js — Full-Stack-Framework mit Pages- und App-Router, zentraler Vergleichspunkt.
- [[prisma]] — ORM, vom Sprecher zur Abgrenzung von TanStack DB genannt.
- [[react router]] — etablierte Routing-Library, deren TanStack-Pendant vorgestellt wird.
- Firebase / Convex — Echtzeit-DB-Services als Beispiele für Real-time-Backends.
- Tailwind — CSS-Toolchain-Option im App-Generator.
- Formik / React Hook Form — ältere Form-Management-Libraries als Negativbeispiel.
- MUI — UI-Komponenten-Bibliothek (Beispiel für aufgeblähte Form-Controls).
- Cloudflare / Netlify — Deployment-Partner und Sponsoren von TanStack.
- Neon — Postgres-Partner zur Integration im Generator.
- Cursor / Visual Studio Code — Editoren für den MCP-Mode der App.
- `create-tanstack-app` — CLI zum Aufsetzen neuer TanStack-Projekte.

## Verwandt

- [MetaFramework](obsidian://open?vault=knowledge-base&file=MetaFramework) — Vergleich TanStack Start vs. Next.js vs. React Router v7, exakt das Framework-Vergleichsthema des Talks.
- [[I moved off of Next.js]] — Theo-Video mit derselben Argumentation für eine SPA-zentrierte Architektur statt Next.js.
- [TanstackRscLikeFeatures](obsidian://open?vault=knowledge-base&file=TanstackRscLikeFeatures) — wie TanStack Start ohne RSC progressives Rendering/SSR umsetzt.
- [tanstack-router-query-loader-priming](obsidian://open?vault=knowledge-base&file=tanstack-router-query-loader-priming) — Loader-Priming-Pattern, passt zu den im Talk gezeigten Loadern.
- [Validation](obsidian://open?vault=knowledge-base&file=Validation) — Gegenüberstellung der TS-Validierungs-Libraries, passt zur Zod-basierten Form-Validierung.
- [[Supabase]] — Realtime-Backend-as-a-Service, verwandt zu den Firebase/Convex-Adaptern hinter TanStack DB.
- [claude-code-mcp-setup](obsidian://open?vault=knowledge-base&file=claude-code-mcp-setup) — MCP-Server-Einrichtung, passt zum MCP-Mode des `create-tanstack-app`.
