# Noname Mobile

Android client for Noname, built with Capacitor.

## Build Flow

The Android project serves the built web app from `../../dist`.

```bash
pnpm build
pnpm -F @noname/mobile sync
```

`sync` first bundles `src/preload.ts` into `../../dist/preload.js`, then runs `cap sync`, and finally renames packaged `.pnpm` assets to `_pnpm` for Android assets compatibility. After syncing, open `apps/mobile/android` in Android Studio or build with Gradle.

Use JDK 21 for Gradle builds. JDK 25 currently fails during Android project configuration.

## File System Model

The mobile client uses Android SAF as a writable overlay over packaged APK assets:

- APK assets are the read-only base layer.
- The SAF directory is the writable overlay layer.
- Reads and static resource requests check SAF first, then fall back to APK assets.
- Writes, creates, deletes, exports, and downloaded/modified user files only affect SAF.

This avoids copying the full game directory during installation. An empty SAF directory is valid; core files such as `noname.js` can still be loaded from packaged assets.

## Startup Permission

On startup, `src/preload.ts` requests SAF directory access before booting the game. The selected directory is stored with persistable read/write URI permission.

The selected directory does not need to contain a full Noname installation. It is used for user-writable data and file overrides.

If a file exists in both layers, the SAF file wins. Removing the SAF file reveals the packaged asset again.

## Native Bridge

The custom Android plugin is `SafFs`.

It exposes the file APIs used by `game.*` in preload:

- `checkFile`, `checkDir`
- `readFile`, `readFileAsText`
- `writeFile`
- `removeFile`, `removeDir`
- `getFileList`
- `createDir`

Read APIs use overlay semantics. Mutating APIs only touch SAF and reject attempts to modify files that exist only in APK assets.

`JsAwarePathHandler` applies the same overlay behavior to `https://localhost/...` WebView requests, so external files can override packaged resources by path.
