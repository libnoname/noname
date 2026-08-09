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
