const CUSTOMIZATION_FOLDERS = ["image/character", "audio/skill", "audio/die", "extension"];

interface GameFS {
	ensureDirectory?: (list: string | string[], callback?: () => void, file?: boolean) => void;
}

export function ensureImportSkeleton(game: GameFS): void {
	for (const folder of CUSTOMIZATION_FOLDERS) {
		game.ensureDirectory?.(folder, () => {}, false);
	}
}
