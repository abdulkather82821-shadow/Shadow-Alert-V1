# Shadow Alert

Shadow Alert is a personal screen-time coach for setting intentional app limits,
reviewing usage patterns, and taking restorative breaks.

## Run locally

```sh
npm install
npx expo start
```

## Build an Android APK

Install the Android SDK and Java 17, then run:

```sh
npx expo prebuild --platform android
cd android
gradlew assembleDebug
```

The debug APK is created at
`android/app/build/outputs/apk/debug/app-debug.apk`.

An APK can also be built with Expo Application Services:

```sh
npx eas-cli build --platform android --profile preview
```

The `preview` EAS profile is configured for an installable APK.