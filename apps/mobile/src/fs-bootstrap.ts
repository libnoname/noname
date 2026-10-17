import type { FileSystem, FileSystemBootstrap } from "../../core/noname/library/fs/index";
import { MobileFileSystemAdapter, SafFs } from "./fs";

export function installMobileFileSystem(bootstrap: FileSystemBootstrap | undefined): FileSystem {
	if (!bootstrap) {
		throw new Error("Mobile preload requires the Core file system bootstrap");
	}

	const fileSystem = bootstrap.install(new MobileFileSystemAdapter(SafFs, bootstrap));
	if (!fileSystem.isSupported()) {
		throw new Error("Mobile file system adapter installation failed");
	}
	return fileSystem;
}
