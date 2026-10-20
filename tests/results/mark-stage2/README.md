# Captured Mark stage 2 evidence

Captured 2026-10-20 on Windows, source engine commit 4761340432b91a7aadab18286f7e0a2eef64c65a.

- source-browser.json and production-browser.json: actual Chrome/GameEvent dispatch, unchanged original skill functions; deterministic card/HP/UI/network effect substitutes. Both contain 19 passing scenarios, source ledgers, totals, skill actors and resolution logs. These are not full gameplay or socket tests.
- default-entry.json: official fs server + default production index.html boot only, no full match claim.
- installed-client.json: read-only state from the user's running Electron client at localhost:8089; confirms loaded build and mode-selection page. No user match was started by this probe.
- typecheck-delta.json: baseline diagnostic comparison, not a clean project tsc result.

Unit command: node --test tests/event-context.test.mjs tests/mark-api.test.mjs tests/mark-context-boundaries.test.mjs. Captured result: 47 total, 45 pass, 0 unexpected fail, 2 TODO.
The two TODO assertions still fail without compilation/instrumentation (runtime native AsyncFunction await, foreign-realm Promise). MARK_STRICT_CONTEXT=1 was run separately and exited 1 as expected. The TODO cases remain executable in the test source; they are not counted as supported behavior.

Source character/guozhan skill diff against f604fd50c870bda892ae25257c2f090a245193fd is empty. Runtime character bundles were rebuilt for the async compiler, not manually patched.
