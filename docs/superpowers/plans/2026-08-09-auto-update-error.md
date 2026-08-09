# Auto Update Startup Error Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent startup from calling the removed `game.checkForUpdate` API while preserving compatibility if the API returns later.

**Architecture:** Move the auto-update scheduling decision into a small dependency-injected helper so it can be tested without loading the browser UI. The existing startup flow calls this helper with `lib.config`, `game`, `sessionStorage`, and `setTimeout`.

**Tech Stack:** JavaScript ES modules, Node.js built-in test runner, ESLint, pnpm.

## Global Constraints

- Do not restore the removed online-update implementation.
- Keep the existing `auto_check_update` configuration compatible.
- Limit runtime changes to the startup auto-check path.

---

### Task 1: Guard and schedule the startup update check

**Files:**
- Create: `apps/core/noname/ui/create/auto-check-update.js`
- Create: `apps/core/noname/ui/create/auto-check-update.test.js`
- Modify: `apps/core/noname/ui/create/index.js:1-10,3133-3142`

**Interfaces:**
- Consumes: `config.auto_check_update`, `game.checkForUpdate(forcecheck)`, `storage.getItem(key)`, `storage.setItem(key, value)`, and `schedule(callback, delay)`.
- Produces: `scheduleAutoUpdateCheck(config, game, storage, schedule): boolean`, returning `true` only when a check was scheduled.

- [ ] **Step 1: Write the failing regression tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { scheduleAutoUpdateCheck } from "./auto-check-update.js";

const createStorage = () => {
	const values = new Map();
	return {
		getItem: key => values.get(key) ?? null,
		setItem: (key, value) => values.set(key, value),
	};
};

test("does not schedule when checkForUpdate is unavailable", () => {
	let scheduled = false;
	const result = scheduleAutoUpdateCheck(
		{ auto_check_update: true },
		{},
		createStorage(),
		() => {
			scheduled = true;
		}
	);

	assert.equal(result, false);
	assert.equal(scheduled, false);
});

test("schedules one update check when the API is available", () => {
	const storage = createStorage();
	const calls = [];
	const game = {
		checkForUpdate: forcecheck => calls.push(forcecheck),
	};

	const result = scheduleAutoUpdateCheck({ auto_check_update: true }, game, storage, callback => callback());

	assert.equal(result, true);
	assert.deepEqual(calls, [false]);
	assert.equal(storage.getItem("auto_check_update"), "1");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test apps/core/noname/ui/create/auto-check-update.test.js`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `auto-check-update.js`.

- [ ] **Step 3: Implement the scheduling helper**

```js
export function scheduleAutoUpdateCheck(config, game, storage, schedule) {
	if (!config.auto_check_update || typeof game.checkForUpdate !== "function" || storage.getItem("auto_check_update")) {
		return false;
	}

	schedule(() => {
		storage.setItem("auto_check_update", "1");
		game.checkForUpdate(false);
	}, 3000);
	return true;
}
```

- [ ] **Step 4: Wire the helper into startup**

Add this import to `apps/core/noname/ui/create/index.js`:

```js
import { scheduleAutoUpdateCheck } from "./auto-check-update.js";
```

Replace the commented legacy block with:

```js
scheduleAutoUpdateCheck(lib.config, game, sessionStorage, setTimeout);
```

- [ ] **Step 5: Run focused and project checks**

Run:

```powershell
node --test apps/core/noname/ui/create/auto-check-update.test.js
pnpm exec eslint apps/core/noname/ui/create/auto-check-update.js apps/core/noname/ui/create/auto-check-update.test.js apps/core/noname/ui/create/index.js
pnpm --filter noname build
```

Expected: both tests pass, ESLint reports no errors, and the core build succeeds.

- [ ] **Step 6: Commit the implementation**

```powershell
git add -- apps/core/noname/ui/create/auto-check-update.js apps/core/noname/ui/create/auto-check-update.test.js apps/core/noname/ui/create/index.js
git commit -m "fix: guard automatic update check"
```
