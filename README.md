# Shadow Alert

Shadow Alert is a mobile screen-time coach for setting intentional app limits, logging check-ins, and taking a restorative pause before the next scroll. Plans and check-ins are stored locally on the device.

> **Prototype note:** The included activity is sample data. Check-ins are entered manually; this release does not read system-wide app usage or block other apps.

## Verify

```sh
npm ci
npm run typecheck
```

## Android APK

The **Build Android APK** GitHub Actions workflow creates a standalone, installable debug APK when changes are pushed to `main` or an `arena/**` branch. In a successful workflow run, download the `shadow-alert-debug-apk` artifact and install it on your Android device. Expo Go is not required. You can also start a build with **Actions → Build Android APK → Run workflow**.

To build locally on macOS or Linux, install Node.js 20, Java 17, and the Android SDK, then run:

```sh
npm ci
npm run build:apk
```

On Windows, run `npx expo prebuild --platform android --no-install`, then from `android/` run `gradlew.bat assembleDebug`.

The APK is created at `android/app/build/outputs/apk/debug/app-debug.apk`. The generated `android/` project and APK are build outputs and are not committed to the repository.
