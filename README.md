# Chicken Clicker — React Native (Expo, TypeScript)

A minimal Expo app that renders your SVG chicken and a bottom navigation using `react-native-svg`.
Tapping the chicken increases the egg counter.

## Quick start

### Prerequisites
- [Node.js](https://nodejs.org/en/download) (LTS recommended)

```bash
npm i -g expo-cli # optional, if you prefer npx you can skip
npm i
npx expo install react-native-svg
npx expo install expo-linear-gradient

npm start

```



to start form the browser: 

```bash

npx expo install react-native-web react-dom @expo/metro-runtime
 
npx expo start --web -c

```
Then press **a** for Android, **i** for iOS, or open in Expo Go.

> If packages mismatch, run `npx expo install` to auto-align versions.

## Files

- `App.tsx` — main screen with HUD, chicken, and bottom nav
- `src/components/Chicken.tsx` — chicken drawn with SVG (paths and circles)
- `src/components/icons/NavIcons.tsx` — simple outline icons using SVG
- `app.json`, `babel.config.js`, `tsconfig.json` — standard Expo + TS setup

## Notes

- All SVGs use `react-native-svg`. If you add more icons, import from `react-native-svg` and draw with `<Path/>`, `<Circle/>`, etc.
- To add screens and navigation, install `@react-navigation/native` and friends.
