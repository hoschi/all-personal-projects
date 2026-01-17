# NextJs Cache Problem v16 with Financy Forecast 2025-12

The worse the network connection gets, the faster the server breaks. Tested with 3G too, you have to click more, but has the same problem.

- tried but didn't help
  - `next build --debug-prerender`
- ideas
  - he's still holding at `getDB`, is there still something wrong with creating the connector?!

## Problem

- concrete description
  - Start server with `DEBUG=*,-next:start-server br start -- -p 3065`
  - Load all pages once
  - Go to the Settings page
  - Set network to "near offline" (1 kbit/s)
  - Switch the last three scenarios that are "off" to "on"
  - Now you see in the client `button click` 3 times directly one after another
  - In the server log you see several problems at once
    1. Although I clicked three times in the client, `handleUpdateScenarioIsActive` is only called _once_, it should actually be started three times in parallel, that's already bad, can't be that it doesn't automatically parallelize. Whatever is blocking there, but not everything running in parallel is not OK!
    2. The scenario items are _immediately_ reloaded since `getScenarioItems` items is called, that doesn't belong to the "update item active" logic. Too bad that `updateTag` isn't throttled or you can influence it here. But I think then you probably have to take `revalidateXY` if it really shouldn't/mustn't be direct
    3. Streaming the response to the client holds everything up and at the end also leads to server crash. How the hell should I ensure that I only link clients without problems to my server, I can do NOTHING on the dev/server side!

## Server error logs

Logs on the first click before it does nothing for 24s

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

After that nothing happens for several seconds (so more than 10s)

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
