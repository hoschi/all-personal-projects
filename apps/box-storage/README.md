# Switch Test

This tests how Tanstack Start Server Functions implementation handles the caching problem in NextJs and how the UI looks for "read-your-own-write" scenarios.

Brief description of the problem with Next v16 (as of January 2026): The new caching mechanisms don't work when the client has a poor network. This is problematic since you can't control that. [Detailed problem description](../financy-forecast/bug.md).

Scenario: The same data set, in this case `hasDiscount`, is visible and changeable in multiple views of the app. With flaky or slow networks, the question is how the app responds.

## Steps

- Start on the `/` route
- Going to `/list` and `/categories` routes, you see the default pending component, for better visibility I've adjusted the settings so it's displayed earlier than usual
- On one page, you can toggle one or more switches and switch to the other page before the change is saved through the 5s delay

## Process

- Data loading happens with a 500ms delay and is thus _faster_ than the switch update! This is supposed to simulate flaky internet since with slow internet you would expect data to load slowly and thus return _after_ the update the already new data.
- The `/list` route uses `useTransition` to visualize the pending state of the update action. It's important to see that the item spinner disappears even though the switch only _toggles_ when the data is reloaded through route invalidation!
- If you toggle three switches and go to the other side, you see the old state and then the data is invalidated and reloaded three times in succession. The UI updates automatically, completely correctly.
- If you now toggle the three switches, go to the other side, toggle two other switches there and go back to the other side, everything still works.
- Going back to the other side also updates everything correctly there.
- A switch that is "on" and clicked first on one side then on the other side remains "off" when all pages have finished loading data

## Conclusion

- In contrast to the NextJs problem, this implementation has none of the various disadvantages and is ready for use.
- What's still missing is a way to show the loading state of the data loader when data is being loaded in the background. The route state is not set to `pending`. This might also be that it's not possible and is due to the simple implementation compared to a more sophisticated logic that is but more complex.
