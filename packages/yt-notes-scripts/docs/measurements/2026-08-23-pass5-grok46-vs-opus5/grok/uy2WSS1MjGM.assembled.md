# TanStack is Your New Favorite Framework

## Worum es geht

Konferenz-Talk auf CascadiaJS: Jason (YouTuber, TanStack-Core-Contributor) stellt das TanStack-Ökosystem vor — Query, Form, DB, Router, Start — und zeigt `create-tanstack-app` live.

---

## Notizen

[URL](https://youtu.be/uy2WSS1MjGM?si=qtSkhKUqV6i6NHEP)

Interessant ist, dass er einen Kurs für Next.js App Router gemacht hat und nachdem er ein Jahr damit gearbeitet hat, sagen muss, dass das nicht gut funktioniert und er alle anderen Alternativen wesentlich besser empfehlen kann. Wichtig ist an der Stelle, dass das Video vor V16 aufgenommen wurde, wo mit Caching bei Next.js sich doch nochmal sehr viel geändert hat. Auch wird kurz darauf eingegangen, dass TanStack Start für SPAs, die APIs nutzen, sehr gut geeignet ist und einen guten Migrationspfad bietet.

---

---

## Besprochene Konzepte

- React Query / TanStack Query — Client-Datenlayer statt `useEffect` plus `fetch`; `useQuery` für Reads, `useMutation` für Server-Änderungen.
- Multi-Framework-Ökosystem — nicht mehr nur React; Name `TanStack` statt nur React Query.
- Library-Tenets — mehrere Frameworks, durchgängige Typsicherheit, saubere und konsistente DX.
- TanStack Form — synchrone und asynchrone Validierung, Zod-Schema, Composability mit Design-System-Komponenten.
- Zod-Wiederverwendung — dasselbe Schema für Formularfelder und für Daten von/zur Server-Seite.
- CRUD vs. Realtime-DB — REST plus Postgres vs. Mutation, Store und Query-Subscription (Firebase, Convex).
- Vendor-Lock-in bei Realtime-DBs — Firebase-Code bleibt Firebase-Code; Convex-Code bleibt Convex-Code.
- TanStack DB — Live Collections und Live Queries mit austauschbaren Adaptern, kein ORM.
- `create-tanstack-app` — Onboarding nach dem CRA-Vorbild, nachdem das React-Team CRA deprecated hat.
- TanStack Router — code- bzw. file-basiertes Routing als ihre React-Router-Variante.
- TanStack Start — SSR und Serving auf Router; SPA-first plus BFF, Server Functions und APIs.
- File-based Routing — Dot-Notation oder Ordner; Routing-Engine austauschbar.
- Loader-Modell — Daten im Loader laden, `useLoaderData` an der Route, typsicher (Remix-Vorbild).
- SSR data-only — Daten beim Page-Load holen, Client rendert; plus `ssr: false` pro Route.
- Server Functions — HTTP-Methode wählbar, Input-Validator, Context, Middleware.

## Behauptungen

- TanStack sei ein sehr guter Einstieg in Open Source. ([0:51](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=51s))
- Cloudflare habe im eigenen Dashboard `useEffect` mit `fetch` genutzt; genau das wolle man nicht. ([1:37](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=97s))
- 30 % aller React-Anwendungen weltweit nutzten React Query. ([2:07](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=127s))
- tRPC und ORPC seien sich uneins, einigten sich aber auf TanStack Query als Kern. ([2:07](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=127s))
- Tanner Lindsley sei kein Egoist wegen des Namens, sondern gut in SEO; `TanStack` sei dafür stark. ([2:48](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=168s))
- Formulare seien schmerzhaft: man wolle keinen Code, dessen Bestleistung „nicht vermasseln“ sei. ([4:10](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=250s))
- TanStack Form sei eine der neuesten Libraries und seine persönliche Favoritin. ([4:10](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=250s))
- Wer eine extrem schnelle Form-Library brauche, habe vermutlich zu viele Felder. ([5:24](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=324s))
- Zod könne man für Form, Server-Payload und onBlur-Validierung wiederverwenden. ([5:24](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=324s))
- Bei Formik und React Hook Form plus großen MUI-Controls würden Formulare zu 500-Zeilen-Monstern; Konsistenz über viele Stellen sei teuer. ([6:51](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=411s))
- TanStack Form fusioniere Validierung mit dem Design System zu Komponenten wie `field.TextField`, die überall gleich mitwandern. ([6:51](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=411s))
- Traditionelles CRUD (POST/GET gegen REST und Postgres) benachrichtige andere Clients nicht. ([8:10](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=490s))
- Realtime-DBs (Firebase, Convex) publizierten Query-Änderungen an alle abonnierten Clients. ([8:10](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=490s))
- TanStack DB sei kein ORM und nicht „das neue Prisma“, sondern State Management mit Live Collections und Live Queries. ([9:39](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=579s))
- Adapter (inkl. Postgres) und eigene Adapter seien möglich; das Backend bleibe wählbar. ([9:39](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=579s))
- Die TanStack-Dokumentation könne viel Arbeit gebrauchen. ([10:57](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=657s))
- `create-tanstack-app` sei wie CRA aufgebaut, mit Router an Bord; Educators könnten CRA-Material mit „Start“ weiterverwenden. ([10:57](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=657s))
- Das Tool sei inzwischen die Hälfte seines Full-Time-OSS-Jobs. ([10:57](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=657s))
- TanStack Start sei nah am Release. ([14:38](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=878s))
- Start vergleiche sich gut mit dem Next.js Pages Router (den viele dem App Router vorzögen) und mit Remix v2; Remix v3 kennen er und Kent nicht. ([14:38](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=878s))
- Pages Router sei durch den App Router de facto abgelöst, Remix v2 unklar — Start sei das ideale Migrationsziel für Full-Stack. ([14:38](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=878s))
- Er habe den Paid Course ProNext.js zum App Router (Joel-Hooks-System, gleicher Publishing-Ort wie Kent), weil Enterprise (Walmart, HP) trotz Kritik migrieren werde. ([14:38](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=878s))
- App-Router-Pages würden groß: 7K HTML würden oft 21K wegen extra Flight-Data. ([14:38](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=878s))
- Nach ein bis zwei Jahren Arbeit am App Router sehe er kaum gute Fits; Pages Router, Remix oder Start passen für Content, E-Commerce und Web-Apps besser. ([16:31](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=991s))
- Tanner sei SPA-first; Start eigne sich für Vite-SPAs mit BFF, typsicheren Server Functions und APIs. ([17:24](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1044s))
- App-Router-Server-Functions gingen nur per POST — schwer zu cachen, CDN-Problem. ([20:14](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1214s))
- Bei Start sei die HTTP-Methode pro Server Function setzbar; Validatoren, Context und Middleware gebe es an API-Routen, Server Functions und normalen Routen. ([20:14](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1214s))
- Cloudflare und Netlify seien Sponsoren; deploybar sei überall, TanStack sei kein Cloud-Anbieter und locke nicht in die eigene Cloud. ([22:02](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1322s))
- Wegen Supply-Chain-Angriffen habe er die AI-Env-Variable in einer Datei versteckt, die wie JPEG aussehe, aber keine sei. ([22:52](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1372s))
- Ausprobieren auf tanstack.com. ([25:12](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1512s))
- Mit MCP-Mode lasse sich das Ding in Cursor oder Visual Studio Code ziehen und in die AI integrieren. ([25:32](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1532s))

## Demos / Schritte

1. Im Terminal `create-tanstack-app` starten (Toolchain-Optionen).
2. Tailwind wählen; optional TanStack DB, Form, MCP-Handler, Partner Neon/Netlify, ORPC/tRPC, TanStack-Chat mit Netlify.
3. `npm dev`, App unter localhost 3000 öffnen.
4. Mitgelieferten Guitar Store zeigen: parametrisierte Routes, Index-Routes, AI-generierte Gitarren.
5. Mit gesetztem Key bzw. `environment local` den Prompt „please recommend a good guitar“ ausführen.
6. Hinweis: jede Library hat Demos; ohne Zusätze bleibt ein Boilerplate.

## Genannte Tools

- TanStack Query / React Query — Datenfetches und Mutationen im Client.
- tRPC — typsichere Remote Procedure Calls, laut Sprecher auf Query aufgebaut.
- ORPC — Open-API-Variante derselben Idee, ebenfalls auf Query.
- TanStack Form — Formular-State, sync/async Validierung, Design-System-Composability.
- [Validation](obsidian://open?vault=knowledge-base&file=Validation) — Zod als Schema für Form und Server-Payloads.
- Formik — ältere Form-Library; Callback-Modell, laut Sprecher schwer mit großen Design-System-Controls.
- React Hook Form — dasselbe Problembild wie Formik in großen MUI-Formen.
- MUI — Beispiel für 30-Zeilen-Controls in Formularen.
- TanStack DB — Live Collections/Queries, Adapter statt Vendor-API.
- Firebase — Realtime-DB-Beispiel mit Vendor-Lock-in.
- Convex — zweites Realtime-DB-Beispiel mit Vendor-Lock-in.
- Postgres — klassisches CRUD-Backend und DB-Adapter von TanStack DB.
- [[prisma]] — Abgrenzung: TanStack DB sei kein ORM / kein neues Prisma.
- create-tanstack-app — Scaffold nach CRA-Vorbild.
- Create React App — von React deprecated; Vorlage für das TanStack-CLI.
- [[Tailwind]] — Default-Styling im Scaffold („weil wir nicht verrückt sind“).
- Neon — Partner-Integration im Scaffold.
- Netlify — Sponsor, Deploy-Partner, TanStack-Chat.
- MCP — optionaler Handler, App als MCP-Server; Mode für Editor-AI.
- TanStack Router — file-/code-basiertes Routing.
- TanStack Start — SSR, Serving, Server Functions auf dem Router.
- Next.js — Full-Stack-Vergleich; Pages Router vs. App Router.
- [[Remix]] — Vergleich (v2 bekannt, v3 unbekannt); Vorbild für Loader.
- [[Vite]] — SPA, die Start um BFF und Server Functions ergänzen kann.
- Cloudflare — Sponsor und Deploy-Ziel.
- [[Cursor]] — MCP-Mode, automatische AI-Integration.
- Visual Studio Code — gleicher MCP-Mode wie Cursor.
- npm — `npm dev` für die Demo.

## Verwandt

- [tanstack-form-mit-start-und-query](obsidian://open?vault=knowledge-base&file=tanstack-form-mit-start-und-query) — Zusammenspiel Form, Start und Query, das der Talk nacheinander vorstellt.
- [tanstack-router-query-loader-priming](obsidian://open?vault=knowledge-base&file=tanstack-router-query-loader-priming) — Loader und Query, passend zum Loader-Modell im Talk.
- [TanstackRscLikeFeatures](obsidian://open?vault=knowledge-base&file=TanstackRscLikeFeatures) — Start-SSR über Loader statt RSC, nahe an data-only SSR.
- [MetaFramework](obsidian://open?vault=knowledge-base&file=MetaFramework) — Start vs. Next.js vs. React-Router-Familie, der Vergleichsrahmen des Talks.
- [tanstack-start-server-client-bundle-boundary](obsidian://open?vault=knowledge-base&file=tanstack-start-server-client-bundle-boundary) — Server Functions und die Server/Client-Grenze.
- [[React Query Creator Tanner Linsley on The Future of RSC, TanStack Start & AI Impact on Dev Tools]] — anderer Talk zum selben Stack (Query, Start, AI).
- [tanstack-docs-for-llms](obsidian://open?vault=knowledge-base&file=tanstack-docs-for-llms) — Doku zu Start, Router, Query, Form; der Sprecher bittet um Doku-Hilfe.
- [claude-code-mcp-setup](obsidian://open?vault=knowledge-base&file=claude-code-mcp-setup) — MCP in der IDE, analog zum MCP-Mode in Cursor/VS Code.
- [[parsing-validating-typescript]] — Zod als Schema-Standard, den der Sprecher für Forms preist.
- [[cloudflare-pages]] — Cloudflare als Hosting, passend zu Sponsor und „deploy anywhere“.
