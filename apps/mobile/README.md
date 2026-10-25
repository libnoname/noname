# Noname Mobile

Android/iOS client for Noname, built with Capacitor.

## Build Flow

The project serves the built web app from `../../dist`.

```bash
pnpm build
# Andoird
pnpm -F @noname/mobile sync:android
# iOS
pnpm -F @noname/mobile sync:ios
```

`sync:android` and `sync:ios` first bundle `src/preload.ts` into `../../dist/preload.js`, then run `cap sync` for the selected platform. Android sync also renames packaged `.pnpm` assets to `_pnpm` for compatibility, while iOS sync generates asset manifests. After syncing, open `apps/mobile/native/android` in Android Studio or build with Gradle; for iOS, open `apps/mobile/native/ios` in Xcode and build there.

## CI Build

Both platforms provide command-line build scripts. Each script builds the web app, syncs assets for its platform, and runs the native build. Use `--skip-web-build` to reuse an existing `dist` directory; platform sync still runs. Both require Node.js, pnpm, and installed workspace dependencies.

### Android

Android builds require JDK 21 and an Android SDK with the required SDK/build-tools packages. Android Studio is not required; the build script uses the Gradle Wrapper to build an APK or AAB:

```bash
pnpm -F @noname/mobile build:android
pnpm -F @noname/mobile build:android -- --aab
```

The default command builds `apps/mobile/native/android/app/build/outputs/apk/release/app-release.apk`. With `--aab`, the output is `apps/mobile/native/android/app/build/outputs/bundle/release/app-release.aab`. Use `--variant=debug` for a debug build.

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

#### Release Signing

Release signing reads values from environment variables first, then from the local `native/android/keystore.properties` file. If no signing values are provided, the build falls back to the debug keystore for development.

For local builds, create `native/android/keystore.properties` (this file is ignored by Git):

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

### iOS

iOS builds require macOS and Xcode 26.0 or later, including the iOS SDK and command-line tools. The build script uses `xcodebuild` to archive the app and export a signed IPA:

```bash
pnpm -F @noname/mobile build:ios -- --team=YOUR_TEAM_ID
pnpm -F @noname/mobile build:ios -- --team=YOUR_TEAM_ID --configuration=Release --method=app-store-connect
```

`--team` is required. The defaults are `--configuration=Debug` and `--method=development`; use `--method=ad-hoc` for ad hoc distribution or `--method=app-store-connect` for App Store Connect. The archive is written to `apps/mobile/native/ios/build/noname.xcarchive`, and the IPA is exported to `apps/mobile/native/ios/build/export`.

#### Release Signing

The script uses automatic signing with the specified Apple Developer team. The build machine must have the signing certificates, private keys, and provisioning profiles required for that team and distribution method. For signed CI builds, provision these credentials on the macOS runner before running `build:ios`; the script does not install them.

## Platform Details

See the platform documentation for file system behavior, startup access, and native bridges:

- [Android](native/android/README.md)
- [iOS](native/ios/README.md)
