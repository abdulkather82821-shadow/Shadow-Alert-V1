# Shadow Alert

Shadow Alert is a calm, cross-platform screen-time coach for setting intentional app limits, logging check-ins, and taking a restorative pause before the next scroll. Your plan and check-ins stay in local device or browser storage.

> **Prototype note:** The included activity is sample data. Check-ins are entered manually; this release does not read system-wide app usage or block other apps.

## Run the application

```sh
npm install
npm run dev
```

The Expo web app is served on port `8081` by default (or the port in `PORT`). The same Expo project can also be opened on a device with `npx expo start`.

## Verify and build

```sh
npm run typecheck
npm run build
npm run serve
```

`npm run build` exports a static web app to `dist/`. `npm run serve` serves that build on port `3000` by default; set `PORT` to change it.

## Android APK

A GitHub Actions workflow builds an installable debug APK on pushes to `main` and `arena/**`. In the completed **Build Android APK** run, download the `shadow-alert-debug-apk` artifact and install the APK on your Android device. It runs as a standalone app; Expo Go is not required.

To build locally, install Java 17 and the Android SDK, then run:

```sh
npx expo prebuild --platform android --no-install
cd android
./gradlew assembleDebug
```

The APK is created at `android/app/build/outputs/apk/debug/app-debug.apk`.
