# Noname Mobile

Android client for Noname, built with Capacitor.

## Build Flow

The Android project serves the built web app from `../../dist`.

```bash
pnpm build
pnpm -F @noname/mobile sync
```

`sync` first bundles `src/preload.ts` into `../../dist/preload.js`, then runs `cap sync`, and finally renames packaged `.pnpm` assets to `_pnpm` for Android assets compatibility. After syncing, open `apps/mobile/android` in Android Studio or build with Gradle.

## CI Build

Android Studio is not required. The Gradle Wrapper and the build script can build the APK or AAB directly:

```bash
pnpm -F @noname/mobile build:android
pnpm -F @noname/mobile build:android -- --aab
```

The default command builds `android/app/build/outputs/apk/release/app-release.apk`. Use `--variant=debug` for a debug APK, or `--skip-web-build` when `dist` has already been built and you only need to run the Android build. Build machines need Node.js, pnpm, JDK 21, and an Android SDK with the required SDK/build-tools packages; Android Studio itself is not needed.

Gradle builds require JDK 21. If another Java version is active, set `JAVA_HOME` and prepend its `bin` directory for the current shell before building. This is temporary and does not change the system-wide Java configuration.

Windows PowerShell:

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
pnpm -F @noname/mobile build:android
```

Linux/macOS or CI Bash:

```bash
export JAVA_HOME="/path/to/jdk-21"
export PATH="$JAVA_HOME/bin:$PATH"
pnpm -F @noname/mobile build:android
```

The script checks the active Java version before building and stops with a clear error if it is not JDK 21. JDK 25 currently fails during Android project configuration.

### Release Signing

Release signing reads values from environment variables first, then from the local `android/keystore.properties` file. If no signing values are provided, the build falls back to the debug keystore for development.

For local builds, create `android/keystore.properties` (this file is ignored by Git):

```properties
storeFile=C:/path/to/noname-release.jks
storePassword=your-store-password
keyAlias=noname
keyPassword=your-key-password
```

For CI, set these environment variables instead:

```text
ANDROID_KEYSTORE_PATH=/secure/path/noname-release.jks
ANDROID_KEYSTORE_PASSWORD=...
ANDROID_KEY_ALIAS=noname
ANDROID_KEY_PASSWORD=...
```

The GitHub Actions release workflow stores the keystore as the `ANDROID_KEYSTORE_BASE64` secret and restores it during the job. Add that secret together with `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, and `ANDROID_KEY_PASSWORD` in the repository settings.

The release APK/AAB is then signed automatically by `build:android`. Keep the keystore and passwords outside the repository; losing the keystore prevents updates to an already-published app.

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
