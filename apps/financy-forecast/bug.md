# NextJs Cache Problem v16 mit Financy Forecast 2025-12

Je schlechter die Network Connection wird, um schneller geht der Server kaputt. Habs mit 3G auch getestet, da muss man mehr klicken, hat aber das gleiche Problem.

- probiert aber nichts gebracht
  - `next build --debug-prerender`
- ideen
  - der hält ja bei `getDB`, ist da immer noch was falsch beim connector erstellen?!

## Problem

- konkrete Beschreibung
  - Server mit `DEBUG=*,-next:start-server br start -- -p 3065` starten
  - alle Seiten einmal laden
  - auf die Settings Seite gehen
  - Network auf "near offline" setzen (1 kbit/s)
  - die letzten drei Scenarios die "off" sind auf "on" switchen
  - jetzt sieht man im client `button click` 3 mal direkt hinter einander
  - im Server log sieht man jetzt mehrere Problem auf einmal
    1. obwohl ich im client drei mal geclickt hab wird nur _einmal_ `handleUpdateScenarioIsActive` aufgerufen, eigentlich sollte das ja drei mal parallel gestartet werden, das ist schon schlimm, kann ja nicht sein das das nicht automatisch paralellisiert wird. Egal was da blockiert, aber das nicht alles parallel läuft ist nicht OK!
    2. die scenario items werden _sofort_ neu geladen da `getScenarioItems` items aufgerufen wird, das gehört nicht zu der "update item active" Logik. Schade das das `updateTag` nicht gethrottled ist oder man hier einfluss nehmen kann. Aber ich denk dann muss man wohl (oder übel) `revalidateXY` nehmen wenn es wirklich nicht direkt sein muss/soll
    3. die antwort zum client zu streamen alles aufhält und am Schluss auch zum Server crash führt. Wie zur Hölle soll ich denn jetzt sicherstellen das ich nur Clients ohne Probleme zu meinem Server verknüpfen, da kann ich ja GAR NICHTS machen auf dev/server seite!

## Server error logs

Logs beim ersten click bevor er 24s gar nichts macht

```
  app:action:handleUpdateScenarioIsActive Updating scenario isActive: id=229aa3f0-93bf-4c29-b2df-041f70dfffc7, isActive=true +0ms
  app:action:handleUpdateScenarioIsActive Calling updateForcastScenario function +0ms
  app:db:updateForcastScenario Updating forecast scenario: { id: '229aa3f0-93bf-4c29-b2df-041f70dfffc7', isActive: true } +0ms
  app:db:executeWithSchema Executing query with schema +0ms
  app:db:getDb Getting database connection +0ms
  app:action:handleUpdateScenarioIsActive updateForcastScenario completed successfully +32ms
compression gzip compression +20s
  app:db:getScenarioItems Fetching all scenario items +0ms
  app:db:executeWithSchema Executing query with schema +0ms
  app:db:getDb Getting database connection +0ms
```

danach passiert mehrere Sekunden (also mehr wie 10s) gar nichts

```
Error: Filling a cache during prerender timed out, likely because request-specific arguments such as params, searchParams, cookies() or dynamic data were used inside "use cache".
    at <unknown> (.next/server/chunks/ssr/apps_financy-forecast_2c9b54b7._.js:1:6987)
    at stringify (<anonymous>) {
  digest: 'USE_CACHE_TIMEOUT'
}
To get a more detailed stack trace and pinpoint the issue, try one of the following:
  - Start the app in development mode by running `next dev`, then open "/forecast" in your browser to investigate the error.
  - Rerun the production build with `next build --debug-prerender` to generate better stack traces.
Error:
    at async m (.next/server/chunks/ssr/apps_financy-forecast_fbac0ea5._.js:1:7003) {
  code: 'NEXT_STATIC_GEN_BAILOUT'
}
```
