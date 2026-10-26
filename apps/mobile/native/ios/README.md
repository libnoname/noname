# Noname iOS

## File System Model

The iOS client uses the app's Documents directory as a writable overlay over bundled resources:

- The app bundle's `public/` directory is the read-only base layer.
- The Documents directory is the writable overlay layer.
- Reads and static resource requests check Documents first, then fall back to bundled resources.
- Writes, creates, deletes, exports, and downloaded/modified user files only affect Documents.

This avoids copying the full game directory on startup. If a file exists in both layers, the Documents file wins. Removing it reveals the bundled asset again. Directory listings merge both layers, with Documents entries taking precedence for matching names.

## Startup and File Access

On startup, [`src/preload.ts`](../../src/preload.ts) initializes the iOS file system and checks that `noname.js` is available. The app uses its own Documents directory without a directory picker or external storage permission prompt.

Initialization creates `image/character`, `audio/skill`, `audio/die`, and `extension` under Documents for imported resources. The directory does not need to contain a full Noname installation; bundled resources remain available as the base layer.

File sharing is enabled in `Info.plist`, allowing users to copy files into the app's Documents directory through the Files app or Finder/iTunes. Preserve game-relative paths when importing resources. Files exported through `game.export` are written to `Documents/export`.

## Native Bridge

The custom iOS plugin is `BundledFileSystem`, registered by `NonameBridgeViewController`. Its `stat` and `readdir` methods query bundled `public/` resources directly.

[`src/platform/ios.ts`](../../src/platform/ios.ts) combines this plugin with `@capacitor/filesystem` to provide the file APIs used by `game.*`:

- `checkFile`, `checkDir`
- `readFile`, `readFileAsText`
- `writeFile`
- `removeFile`, `removeDir`
- `getFileList`
- `createDir`, `ensureDirectory`

`game.checkFile` and `game.checkDir` both call the underlying `statEntry`, which returns `file`, `directory`, or `none`; the JavaScript adapter converts that type into the corresponding check result.

Read APIs use overlay semantics. Mutating APIs only touch Documents; deleting resources that exist only in the bundle is rejected, as is deleting the writable root directory.

`NonameRouter`, installed by `NonameBridgeViewController`, applies the same overlay behavior to `capacitor://localhost/...` WebView requests, so imported scripts, images, audio, and extension files can override bundled resources by path.
