import type { FileSystem, FileSystemBootstrap } from "../../core/noname/library/fs/index";
import { ElectronFileSystemAdapter, type ElectronFileSystemDependencies } from "./fs";

export interface ElectronNodeRequire {
	(moduleName: "fs"): typeof import("node:fs");
	(moduleName: "path"): typeof import("node:path");
}

/**
 * Install the Electron adapter with Node's actual filesystem dependencies.
 * Keeping this boundary typed makes the adapter wiring check the real Node
 * modules instead of relying on the legacy preload's unchecked code.
 */
export function installElectronFileSystem(rootDir: string, bootstrap: FileSystemBootstrap | undefined, nodeRequire: ElectronNodeRequire): FileSystem {
	if (!bootstrap) {
		throw new Error("Electron preload requires the Core file system bootstrap");
	}

	const nodeFs = nodeRequire("fs");
	const nodePath = nodeRequire("path");
	const dependencies: ElectronFileSystemDependencies = {
		fs: nodeFs.promises,
		path: nodePath,
		constants: nodeFs.constants,
	};
	const fileSystem = bootstrap.install(new ElectronFileSystemAdapter(rootDir, dependencies, bootstrap));
	if (!fileSystem.isSupported()) {
		throw new Error("Electron file system adapter installation failed");
	}
	return fileSystem;
}
