# Noname Android

## File System Model

The Android client uses SAF as a writable overlay over packaged APK assets:

- APK assets are the read-only base layer.
- The SAF directory is the writable overlay layer.
- Reads and static resource requests check SAF first, then fall back to APK assets.
- Writes, creates, deletes, exports, and downloaded/modified user files only affect SAF.

This avoids copying the full game directory during installation. An empty SAF directory is valid; core files such as `noname.js` can still be loaded from packaged assets.

## Startup Permission

On startup, [`src/preload.ts`](../../src/preload.ts) requests SAF directory access before booting the game. The selected directory is stored with persistable read/write URI permission.

The selected directory does not need to contain a full Noname installation. It is used for user-writable data and file overrides.

If a file exists in both layers, the SAF file wins. Removing the SAF file reveals the packaged asset again.

## Native Bridge

The custom Android plugin is `SafFs`.

[`src/platform/android.ts`](../../src/platform/android.ts) adapts this plugin to provide the file APIs used by `game.*` in preload:

- `checkFile`, `checkDir`
- `readFile`, `readFileAsText`
- `writeFile`
- `removeFile`, `removeDir`
- `getFileList`
- `createDir`

`game.checkFile` and `game.checkDir` both call the underlying `statEntry`, which returns `file`, `directory`, or `none`; the JavaScript adapter converts that type into the corresponding check result.

Read APIs use overlay semantics. Mutating APIs only touch SAF and reject attempts to modify files that exist only in APK assets.

`JsAwarePathHandler` applies the same overlay behavior to `https://localhost/...` WebView requests, so external files can override packaged resources by path.
