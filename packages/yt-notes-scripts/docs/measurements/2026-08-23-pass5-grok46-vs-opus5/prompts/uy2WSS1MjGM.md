Du bekommst ein audited_md eines YouTube-Videos (Werbung schon ausgeschnitten).

Vault-Kontext: Die Zusammenfassung wird in eine Markdown-Datei geschrieben, die
im Obsidian-Vault `test` (Shared-Vault) liegt — Pfad
`shared/youtube/<channel>/<title>.md`. Wikilinks `[[…]]` lösen NUR innerhalb
dieses Vaults auf. Treffer aus dem KB-Vault (`knowledge-base`) brauchen
deshalb `obsidian://`-URIs — siehe Wikilink-Verfahren unten.

Aufgabe: Schreibe eine deutsche Zusammenfassung als Markdown, strukturiert in
folgende Sektionen. Setze Wikilinks zu KB-Artikeln im Vault aktiv, wo
entsprechende Sektionen das vorsehen.

## Worum es geht

Ein bis zwei Sätze: Was ist Thema und Kontext.

## Besprochene Konzepte

Bullet-Liste der inhaltlichen Konzepte / Theorien / Ansätze.
Pro Bullet: "<Konzept> — <ein Halbsatz Beschreibung>".
Wenn der Konzept-Begriff einen passenden Vault-Artikel hat (OHS-Lookup
geprüft, siehe Wikilink-Verfahren unten): "[[<artikel-name>]] — …".

## Behauptungen

Bullet-Liste konkreter Aussagen des Sprechers — Fakten, Empfehlungen,
Wertungen über Tools/Produkte/Vorgehen.
Pro Bullet: "<knappe Behauptung>" (optional: `(<timestamp>)` am Ende).
KEINE Wikilinks in dieser Sektion — die landen in `## Verwandt` unten.

Timestamp-Format STRIKT (nur wenn du einen aus dem audited_md übernimmst):
M:SS, MM:SS, H:MM:SS oder HH:MM:SS — IN runden Klammern, KEINE
selbstgebauten Markdown-Links. Die Timestamps werden in einem
deterministischen Post-Process zu YouTube-Marker-Links umgeschrieben.

Behauptung vs Spekulation:
- **DEINE** Spekulation ist verboten:
    - "Vermutlich meint der Sprecher …" — keine eigene Interpretation
    - "Daraus folgt …" — keine eigenen Schlüsse
    - "Das könnte zu Z führen" — keine Vorausschau
- **Sprecher-Spekulation** ist OK: wenn der Sprecher selbst vermutet
  ("ich glaube X wird Y überholen"), übernimm es mit Marker
  "Laut Sprecher …" oder "Der Sprecher vermutet …".
- Faustregel: bei Unsicherheit ob du eine Behauptung wörtlich ins Original
  zurückführen kannst, weglassen.

## Demos / Schritte

Falls etwas vorgeführt wird: nummerierte Liste, jeder Schritt knapp.
Wenn nichts vorgeführt wird, Sektion weglassen.

## Genannte Tools

Bullet-Liste der explizit genannten externen Tools / Frameworks / Produkte.
Pro Bullet: "[[<vault-artikel-name>]] — <Halbsatz Funktion>" wenn Match,
sonst Klartext-Name.
Wenn keine Tools im Video: Sektion weglassen.

## Verwandt

Bullet-Liste von Vault-Artikeln, die zum Video-Thema verwandt sind —
auch wenn nicht explizit im Video genannt. Quelle: OHS-Lookup mit
Video-Thema/Konzept-Phrasen.
Pro Bullet: "[[<artikel-name>]] — <Halbsatz, was die Verbindung ist>".
Keine Duplikate zu den schon in Konzepte/Tools verlinkten Artikeln.
Wenn nichts verwandt: Sektion weglassen.

---

Wikilink-Verfahren (für Konzepte, Tools, Verwandt — Pflicht):
1. Bash-Aufruf (mit explizitem Node-Interpreter — claude-CLI Sub-Agent erbt
   einen PATH, in dem ein Node v26 vor Node v22 steht, was den OHS-internen
   `better-sqlite3` mit NODE_MODULE_VERSION-Mismatch kaputtmacht):
   OHS_NODE_BIN=$HOME/.asdf/shims/node /Users/hoschi/repos/kims/scripts/ohs-search-merged.sh --vault-type arbeit --no-yt --limit 3 --json '<query>'
2. Score-Lese: nur Hits mit `score_native >= 0.8` betrachten (NICHT score_rrf —
   der ist Rank-basiert und liegt im Bereich ~0.01-0.02, also nie >= 0.8).
3. Title-Match-Prüfung gegen Video-Kontext:
   - Bei Mehrdeutigkeit (z.B. "Claude" → "Claude Code" vs "Claude API"):
     Kontext-Snippet aus diesem Video entscheidet
4. **Link-Format strikt nach `source_index` des Hits** (siehe JSON-Antwort):
   - `source_index: "shared"` → `[[<exakter-hit-title>]]` (Wikilink, gleicher Vault)
   - `source_index: "kb"` → `[<exakter-hit-title>](obsidian://open?vault=knowledge-base&file=<URL-encoded-file_path-OHNE-.md>)`
     **`.md`-Suffix wird abgeschnitten** (Obsidian-URI erwartet den File-Namen
     ohne Extension — sonst öffnet der Klick eine neue Stub-Datei statt der
     Ziel-Datei). URL-Encoding: Leerzeichen → `%20`, Slashes `/` → `%2F`,
     Sonderzeichen (Umlaute, Bindestrich-em-dash, Apostrophe) entsprechend RFC 3986.
     Beispiel: file_path `claude-code-mcp-setup.md` → `file=claude-code-mcp-setup`.
     Beispiel mit Sonderzeichen: `yt-pipeline — decisions.md` → `file=yt-pipeline%20%E2%80%94%20decisions`.
5. Kein Match / Score zu niedrig: Klartext lassen,
   KEINEN spekulativen Wikilink.
6. NIEMALS `[[…]]` für einen Hit mit `source_index: "kb"` — das wäre ein
   toter Cross-Vault-Link.
7. NIEMALS ein Markdown-Link mit relativem Vault-Pfad für eine Vault-Notiz —
   weder `[text](shared/…/datei.md)` noch `[text](knowledge-base/…/datei.md)`.
   Solche Pfade lösen in Obsidian NICHT auf. Es gibt nur zwei erlaubte Formen:
   Same-Vault → `[[…]]` (Punkt 4, source_index shared),
   KB-Vault → `[…](obsidian://…)` (Punkt 4, source_index kb).

Globale Regeln:
- NUR was der Sprecher tatsächlich sagt
- Sprache: deutsch
- Keine harten Längen-Limits
- Links (Wikilinks [[…]] und [text](obsidian://…)) NIEMALS in Backticks
  einschließen — Backticks rendern den Link als Inline-Code statt als
  klickbaren Link. Die Backtick-Beispiele oben dienen nur der Darstellung.
- Gib AUSSCHLIESSLICH den Markdown-Body aus (beginnend mit "## Worum es
  geht"). Keine Vorrede, kein Denken, keine Meta-Kommentare wie "Ich schreibe
  jetzt die Zusammenfassung", keine zusätzlichen Überschriften außer den oben
  definierten Sektionen.

Input audited_md:
### [0:00](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=0s) — Intro & applause

Yeah. Come on. Seriously, this guy's been killing it all day. Give a big hand of applause, Jason. Come on.

### [0:20](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=20s) — What is TanStack?

So, I'm here to start talking about Tanstack. And you just heard about Tanstack from Shrudy. He's a good friend of mine. And I've talked to a couple people so far like how many people here raise your hand know about this term tan stack. Oh, okay. Great. That's actually really good.

### [0:51](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=51s) — Who I am & joining OSS

All right. So, let's just talk about me for a second. So, I am a YouTuber and one of the little secrets about folks at YouTube is it's kind of like a solitary thing. It's like you stand in front of a green screen and all that gets kind of, you know, you want community, you want a team. So, late last year, I decided I was going to join an open source initiative and I picked Tanstack and now I am a TanStack core contributor with a bunch of my good friends over on the Tanstack team, including Tanner Lindsley. So, I got to say, you know, if you want to get into OSS, Tanstack is a fantastic place to be.

### [1:29](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=89s) — React Query overview

But if you don't know about what Tanstack is, you might have heard of our most popular library, React Query. So, anybody heard about that one?

### [1:37](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=97s) — The "useEffect + fetch" anti-pattern

All right, good. Well, the Cloudflare folks should have because they just did themselves on their own dashboard and it's because they used use effect with fetch, which is the exact thing you don't want to do. And that's exactly what React Query is there to help you with.

### [2:07](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=127s) — useQuery/useMutation basics & adoption

So, let's take a look. For example, if you've ever used use query in your application. You go and make a fetch. Use mutation that change stuff on the server. And this is an incredibly popular library. 30% of every React of all the React applications of the world use React Query. That is absolutely monstrous and it's at the core of some of the really coolest ecosystem extensions that we have in terms like TRPC remote procedure calls typed and ORPC which gives you an open API version of that. It's such a good library that it's at the core of both of those. So they don't agree on everything but they at least agree on using Tanstack Query.

### [2:48](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=168s) — Beyond React: multi-framework + naming

But nowadays it's about more than just React. We support all kinds of libraries across the ecosystem. So it's not just about React Query which kind of leaves us with like a naming quandary, right? So we had React Query now we're more than that. So what we did was we injected Tanstack and we created the Tanstack ecosystem and Tanner Lindsley is our kind of head person. So, you know, you might think that he's a real egotist for that, but no, actually, he's really good at SEO. And it turns out that Tanstack is fantastic for SEO. So, now we have Tanstack at a whole bunch of libraries, including my own, which is great.

### [3:35](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=215s) — TanStack principles (types, DX, consistency)

And one more thing that we have, we have basically some tenets of all of the libraries across the whole ecosystem. One, they need to support multiple frameworks like you saw. They have to be type safe across the whole system. So, React Query is helping you be type-safe and we really focus on making the DX absolutely fantastic. So, the developer experience is clean and consistent and we worked really, really, really hard on that.

### [4:10](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=250s) — TanStack Form: why forms are hard

And as I say, you know, nowadays it's more than just about Tanstack Query. There's a whole bunch of libraries there.

Let's talk about Tanstack Form because that's one of the newest libraries and it is actually my personal favorite new library.

How many of you have dealt with like form mechanics? Yeah, come on. Everybody raise their hand because I mean seriously, who hasn't done a form on the web, right? And they're just a pain. They're a pain to get right. Like that's the one of the things you want to — you like you never want to be writing code where the best thing you can do is not screw up. And that's what form writing is about.

So what are some really fantastic parts of it? Well, one, you get asynchronous and synchronous validation.

### [5:24](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=324s) — Zod-based validation (sync + async)

So not only can you do things like regex validation all that sort of stuff but if you have for example like you want to go and validate if we ship to this person at this address you need to make an API call that's built into the system so that you can do asynchronous validation as well as synchronous validation. It's super fast.

Personally I don't know why that's a big deal when it comes to forms. If you need like a super fast form library you probably have too many fields on your form. But hey it's good. And of course the DX is great. So, let's actually dig into that a little bit.

Here we've got some code quickly — what we're going to use is we first define the form using Zod. Zod's, you know, everybody's into that nowadays. One of the great things about defining it with Zod is that you can actually use this for other things. You could go and validate the data coming back from the server or going to the server. So I love when you have a system that works well with other systems and you get that multiplication factor. So now I can use it in my form. I can use it as my validator for my fields down there when I do the onBlur. You can do different types of event validation. You give your default values and then the submit and that's it. That's fantastic.

### [6:51](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=411s) — Composability with design systems

But one of the really cool things and this is my favorite feature of this particular framework because I used to work at Nike and Walmart. I was the architect over there and so I would deal with all those forms and all that. And one of the things that I would deal with was our design systems and that was one of the problems we had when it came to form management systems like Formik and React Hook Form. You go and get these cool callback things where it tells you, hey, here's a field validator or blah blah blah. And then you put in this massive MUI control that was just like 30 lines to just do like, you know, a name or whatever. And so your form would be just this 500 line monster.

And anytime you wanted to change or make sure that was consistent across the board, that was like you'd end up having to change it in all these different spots. If you want to like change the way we formatted an input field or whatever. What we can do with TanStack Form is we have a composability layer. So we actually fuse the validation logic with your design system and we create new components. So in this case like this field.TextField that are standardized so that when you change your text field it changes everywhere on every single form.

And so that's why this is my personal favorite little library that we've just released.

### [7:35](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=455s) — TanStack DB: real-time is better than CRUD

Another big one that I really gotten into lately is Tanstack DB. Had anybody heard about this? Because it's actually really new. Cool. Kent knows about it. I like that.

### [8:10](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=490s) — CRUD vs real-time DBs explained

Well, Kent probably doesn't like traditional CRUD, do you, Kent? No. Nobody likes traditional CRUD. So, what CRUD is — create, read, update, delete. And we don't like that. So, it's kind of a pain. What we like instead are real time DBs.

So let's define what these things are. Well, a traditional CRUD system is basically you post to a REST API that goes to Postgres and you like add a to-do like everybody's done this, right? This is classic web. And then to go and get the to-dos, you call get and you get your to-dos and they might have been updated in your DB. Cool. Awesome. The only problem is that well, one, you have to manage all that yourself. And two, if you got another web client, it's like some other user that's also looking at the to-dos, they have no idea that that happened.

What real time DBs allow you to do is they allow you to go and create functions or mutations like add to-do. They connect to real time DB services like in this case Google's Firebase or Convex and they manage a store. And then on the client, you actually subscribe to the query that says, "Okay, I want all those to-dos." and it manages actually publishing out the changes to all of the different web clients that are looking at that. So, it's just a fantastic way to do database stuff that doesn't suck.

### [9:39](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=579s) — Adapters & vendor-neutral backend

So, what the problem with this is that real-time DBs are great, but they also kind of lock you into a vendor. If you're writing Firebase code, you're writing Firebase code. If you're writing Convex code, you're writing Convex code.

But what if you could take the Firebase client and just replace it with TanStack DB — we actually take all of the guts out of it. Not really. I mean we write it on our own and create live collections and a whole query system, a whole live query system and maybe put it in there and then we open source it and we take that data store and we make just any adapter you want. You can go and build your own adapters. There's adapters that we get out of the box that go to Postgres and they manage all of that connection for you. But you get to decide what kind of data sources you want on the back end. It is an amazing system and I actually can't believe that we did this. And when people think about it, they're like, "Oh, TanStack DB, is that like an ORM mapping? Is it like the new Prisma or something like that?" No, it's this whole new state management, live collection system, live query system is absolutely just fascinating. So, if you're really into this, go check out my video on it.

### [10:57](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=657s) — Getting started: create-tanstack-app demo

That was two out of the things that I want to cover, but let's talk about how you want to get started. So this is actually where I'm going to go off the rails a little bit.

And I am going to go with a terminal and we're actually going to try this out.

When I first started on Tanstack, I was doing like documentation and that kind of stuff and that's a great place to start. Actually, our documentation could use a lot of work. So if you are into that sort of thing, big kudos if you would help with that. But the React team decided to deprecate CRA. You guys remember that one where they're like, "Oh, you shouldn't use create react app anymore." And I was like, Tanner, let's go and make a create tanstack app. You know, exactly the same thing. It looks exactly the same and it's kind of set up the same way except that we automatically have React Router in there and we kind of give people a great onboarding experience. And then educators like Kent and I who have lots of videos using create react app can basically just say, well, just, you know, kind of copy and paste create React in there and just put in start and you're good to go. So, I created that and now it's my baby and like all OSS now this is half of my full-time job.

So let's go and build out an app and we'll use Tailwind because we're not crazy. There are toolchain options. We can go and select DB because we just talked about that and Form. We have an MCP handler that you can have to build in automatic MCP support if you want to become an MCP server. How cool is that?

There you go. Right. Exactly. You can integrate with a lot of our partners like Neon and Netlify. You can even bring in cool cutting edge stuff like ORPC and TRPC, but we'll just leave it at that. And then I'm actually also going to bring in this Tanstack chat system that we built together with Netlify. And this is really cool because it's going to show you some AI features.

### [13:45](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=825s) — TanStack Router & Start

Okay, let's get back to the talk while that cooks.

Tanstack Router and Tanstack Start. So if you want to do basically code-based routing and things like that, we have our version of React Router called Tanstack Router. And then we got Tanstack Start which adds on all the SSR and all the serving capabilities based on top of that.

### [14:38](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=878s) — Comparing Next.js/Remix & a confession

So when you think about what's in the full stack space currently, there's Next.js. Everybody excited about Next.js lately? Yeah. Okay. A little bit of a different vibe there. There's Remix. Yeah. Woo. All right. And now there's Tanstack Start.

Yes. And we are so close to release. Oh my gosh. It's crazy.

And comparatively, I like to think about them as it really compares nicely with the Next.js pages router, which I think a lot of folks are happier with than the Next.js app router. And I would say Remix v2. We have no idea and nor does Kent about what Remix V3 is going to be. So when you're thinking about like your migration target, well, you know, pages router is deprecated because they released the app router and Remix v2 is I guess I don't know whatever. Anyway, unknown. So Tanstack Start seems to be the ideal migration if you want to go and build out a full stack app.

And this is where I get to the uncomfortable thing, which is I mentioned on Twitter a while back that I was going to make a confession at Cascadia and this is it. So, Kent and I actually share that we both publish to the same spot when it comes to our paid courses. I only have one, and it's called ProNext.js and we both work off of Joel Hook's system and it's very, very good and I'm really proud of this course actually. This is a course on the app router and I made it because I was like, you know what, Next.js is coming out with the app router. I've worked in enterprise context. When I was at Walmart, HP, I know these folks are going to be like, "Oh, pages router's dying. Let's go to the app router regardless of what anybody says." So, I made this course and I did say that there were some issues with it. Like, the page sizes were really big. Like, you know, if you have like 7K of HTML, your page size is probably going to be 21K because of all this extra flight data that they add on. So, I was upfront about it and I'm like, well, you know, people get to make their own informed decisions.

### [16:31](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=991s) — Where App Router fits (or not)

But, I got to say after having worked with it for probably a year or two that I don't really think there's a lot of good fits with the App Router. So, let's like do a little matrix comparison here. So, content sites, think like a blog or a news site or something like that. E-commerce, think nike.com, think Walmart.com, think whatever. Amazon. Web applications. Think like a Jira or maybe even a Figma. I think honestly that you wouldn't go wrong if you picked the pages router on almost any of those or Remix or now Tanstack Start.

I can't say the same thing about the app router. I just don't think it's a good fit to be honest with you and I have yet to find a really good fit for the app router. Is there any agreement on that or no?

Okay. All right. Fine. You can hit me up later and tell me I'm wrong. That's fine.

### [17:24](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1044s) — SPA-first + SSR/SPA hybrid model

What I think Tanstack Start does is it opens up actually a new vector which is really cool. Tanner's a big SPA guy. He's kind of a SPA-first guy. So really this is a very good framework even though it does server-side rendering for SPAs. He's been really passionate about that. So now think about the idea of taking your SPA, your Vite SPA, and adding on and having those BFFs — the back end for front end — rolled into the app type safe and all that with server functions and APIs.

You can get there with Tanstack Start. So I think it opens up kind of a whole new architecture for us for a single app that has mostly a SPA experience but with APIs and server functions.

### [18:11](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1091s) — File-based routing & loaders

So let's kind of dig into a little bit. So we use file-based routing much like the pages router, much like the app router, much like Remix. If you want to take a look at it, it's in this case I'm using the dot notation. So it's API dot but you can use folders. You can even go and make your own. You can literally change out that engine and do it any way that you want. When it comes to server-side rendering, we kind of followed the Remix model a little bit. So, we have loaders and you can just call to get your data and then get the use loader data off the route, which is really nice. That's a fully type-safe thing. So, everything in there would be fully type-safe.

### [19:03](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1143s) — SSR "data-only" and per-route SSR

But some really cool new additions. This is really neat.

SSR data only mode. So what this does is if you've got a SPA route, but you have some data that you want to make sure is there when the page is rendered, data only. So this means that we're only going to go get the data. We're going to keep it as part of the page load. We're going to send that up to the client and the client does the render up there. So when it comes to building out SPAs, fantastico.

And then of course you can just turn SSR off on a per-route basis by using SSR false. Which means that when you think about like an e-commerce shop, you could have your homepage, your product detail page, your search page, all with just SSR as true and then your cart and checkout and all that with SSR false or data only if you want. And you got a really nice experience, but you've got a nice route by route definition on that and all of your app logic is in one app as opposed to having lots of little mini apps, some of which are SPAs based on Vite, some of which are Next.js, you know, all that stuff.

### [20:14](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1214s) — Server functions (methods, validators, middleware)

And then bringing in some really cool stuff from the app router but then improving on it. We now support server functions in a way. The server functions in the app router — and I don't know if you know this — they only ever do POST which means that you can go take the server calls that are happening there, that's going to happen on the server and that's great, but if you got some data that you just want to get, it's going to be a POST and that's really hard to cache and that's a serious performance problem, a CDN problem. So you get to define the method for every one of those server functions.

You also get to define a validator. So validators, you can go add data validators on your input so you make sure that nobody's going to spam your server functions. You can go and add context on the server side and on the client side. You can add middleware at any point on any API route, on any server function, on any regular route. It's fantastic. So we've done a lot of work on this. This has been multiple years in the development.

### [22:02](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1322s) — Deploy anywhere (Cloudflare, Netlify, etc.)

People ask a lot about deployment like okay cool you know where am I actually going to be able to deploy this thing? Well, we partnered with Cloudflare and Netlify. They're proud sponsors of Tanstack and they are supporting us when it comes to our deployments, but you can deploy anywhere you want. And we are not a cloud provider. So, we don't have any dog in that fight. We're not going to try and bend the framework to make sure that you use our cloud provider or any of that.

### [22:34](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1354s) — Full TanStack ecosystem snapshot

And then, you know, sort of zooming back, this is all the stuff that you didn't get to see, but this is the entire range of all the Tanstack ecosystem that we currently have.

### [22:52](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1372s) — Live demo boot-up

That doesn't even mention my app. So, let's go take a look at what happened on that. So, this is what — oh, you can see it. Cool. All right.

So, let's bring up our application. npm dev. Cool.

So, have you guys heard about the recent supply chain attacks? I used to put all my environment variables like in my global environment. So, I was like, "Okay, I'm going to be presenting tomorrow. I need to put my environment variable for AI somewhere." So, I put it in a JPEG file, but not really a JPEG file. I figure, you know, I'll give it a try and shake him loose somehow. Okay. I got compliments from it actually. Jam said, "Yeah, that was a good idea."

All right, let's take a look. Local host 3000.

### [24:02](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1442s) — Guitar store demo + AI prompt

Yeah, there we go. Cool. All right, so you get this out of the box and so many cool demos here.

Okay. So, one of the cool things that we've done is there is a full guitar store app that's built in here that shows you how to do parameterized routes and index routes. You can go and select on these all AI generated guitars yada yada yada. And if you give us a key or if you put in environment local, you can go say, please recommend a good guitar.

The little things you don't think about when you're like, I'm going to be presenting. It's going to be super cool. But all with integrated tooling and also client tooling and all that. So a really nice demo of all of the stuff that I just talked about — DB, Form. Every one of our libraries has demos in here that you can select or you can just select to do none of that and get a really nice boilerplate that you can just start with and go. I think it's going to be really exciting. So I'm really happy that we're bringing Tanstack to you.

### [25:12](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1512s) — Wrap-up & call to action

And yeah, that's pretty much all I got to say. So, thank you for having me.

Yeah, try it out today over at tanstack.com. Oh, one more thing.

### [25:32](https://www.youtube.com/watch?v=uy2WSS1MjGM&t=1532s) — MCP mode in editors & closing applause

Actually, you can actually run my thing with an MCP mode, take it into Cursor or Visual Studio Code and it'll automatically integrate into your AI.