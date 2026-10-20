/** 供玩家用「文件」App 手动导入的目录骨架（相对可写根目录） */
const IMPORT_FOLDERS = ["image/character", "audio/skill", "audio/die", "extension"];

/** 放在可写根目录里的中文说明 */
const IMPORT_README_NAME = "使用说明.txt";

// 用模板字符串而非字符串数组：一整段多行文本可读性好得多，prettier 也不会把它压成一行。
const IMPORT_README = `无名杀 · 手动导入说明

把文件放进下面这些目录，然后重启游戏即可生效（不需要重装）。
目录里没有的文件会继续使用 App 内置资源，所以只放一部分也没问题；
把这里放的文件删掉，就会还原成内置版本。

image/character/   武将立绘
    文件名用武将 ID，例如 zhaoyun.jpg
    国战立绘前面加 gz_，例如 gz_zhaoyun.jpg

audio/skill/       技能语音
    文件名用技能 ID，例如 benghuai.mp3
    同一技能多段配音可用 benghuai1.mp3、benghuai2.mp3

audio/die/         阵亡语音
    文件名用武将 ID，例如 zhaoyun.mp3

extension/         扩展
    每个扩展一个文件夹，文件夹名就是扩展名，例如 extension/我的扩展/

提示：也可以用游戏内「菜单 → 其它 → 更新 → 下载素材」自动补齐官方原画与语音。
`;

/** `ensureImportSkeleton` 需要的 `game` 方法子集 */
interface ImportTarget {
	ensureDirectory?: (list: string | string[], callback?: () => void, file?: boolean) => void;
	checkFile?: (fileName: string, callback?: (result: -1 | 0 | 1) => void, onerror?: (err: Error) => void) => void;
	writeFile?: (data: string | Blob, path: string, name: string, callback?: (error?: unknown) => void) => void;
}

/**
 * iOS 上预建导入用的目录骨架，并放一份中文说明。
 *
 * 背景：`Info.plist` 打开 `UIFileSharingEnabled` + `LSSupportsOpeningDocumentsInPlace`
 * 之后，App 的 `Documents/` 会出现在「文件」App 的「我的 iPhone」下，玩家可以手动
 * 放入素材与扩展。但若目录是空的，玩家既不知道能放什么、也不知道文件该叫什么名字，
 * 于是这里在首次启动时把目录和说明准备好。
 *
 * 全部「尽力而为」：任何一步失败都只记日志，绝不能影响游戏启动。
 */
export async function ensureImportSkeleton(game: ImportTarget): Promise<void> {
	// `ensureDirectory` 底层是递归建目录，失败时会走 console.error
	for (const folder of IMPORT_FOLDERS) {
		game.ensureDirectory?.(folder, () => {}, false);
	}

	// 说明文件已存在就不覆盖——玩家可能自己编辑过
	const existed = await new Promise<boolean>(resolve => {
		try {
			game.checkFile?.(
				IMPORT_README_NAME,
				result => resolve(result === 1),
				() => resolve(false)
			);
		} catch {
			resolve(false);
		}
	});
	if (existed) {
		return;
	}

	// path 传空串表示写到可写根目录本身
	game.writeFile?.(IMPORT_README, "", IMPORT_README_NAME, () => {});
}
