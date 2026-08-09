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
