# Chicken Clicker — React Native (Expo, TypeScript)

A feature-rich clicker game built with Expo and TypeScript. Tap your chicken to lay eggs, then spend them on powerful upgrades to boost your production. Unlock achievements, claim rewards, and climb your way to egg-laying glory!

This project runs on both native (iOS/Android) and web platforms.

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/en/download) (LTS recommended)
- [Expo Go](https://expo.dev/go) app on your iOS or Android device (for native).

### 1. Installation

Clone the repository and install the dependencies:
```bash
git clone https://github.com/your-repo/chicken-clicker-expo.git
cd chicken-clicker-expo
npm install
```

> If you encounter dependency issues, run `npx expo install` to ensure all packages have compatible versions.

### 2. Running the App

You can run this project on native mobile devices or in a web browser.

#### Native (iOS & Android)

Start the development server:
```bash
npm start
```
Then, scan the QR code with the **Expo Go** app on your phone. You can also press `a` to run on an Android Emulator or `i` for the iOS Simulator.

#### Web

Start the development server in web mode:
```bash
npm run web
```
This will automatically open the project in your default web browser.

## Project Structure

### Entry Points

- **`index.js`**: The main entry point for the React Native (iOS/Android) app. It registers the root `App` component.
- **`src/main.tsx`**: The main entry point for the web version of the app, which renders the `App` component into the DOM.
- **`App.tsx`**: The root component shared by both native and web. It contains the main game logic, state management, and layout.

### Core Components

- **`src/components/Chicken.tsx`**: The clickable chicken SVG.
- **`src/components/Upgrades.tsx`**: The panel displaying available upgrades, their costs, and levels.
- **`src/components/Achievements.tsx`**: The panel for viewing and claiming achievement rewards.
- **`src/components/AnimatedEgg.tsx`**: A falling egg animation triggered on each click.
- **`src/components/AnimatedFloatText.tsx`**: The "+1" floating text animation on click.
- **`src/components/icons/NavIcons.tsx`**: SVG icons for the bottom navigation bar.

### Configuration

- `app.json`, `babel.config.js`, `tsconfig.json` — Standard Expo + TypeScript project configuration.

## Features

- **Click to Lay**: Tap the chicken to produce eggs, the primary currency of the game.
- **Upgrades**: Spend your eggs in the "Upgrades" tab to boost your production:
  - **Peck Power**: Increases the number of eggs you get with each tap.
  - **Auto-lay**: Provides a steady, passive income of eggs per second.
  - **Golden Luck**: Increases the chance of a "golden tap," which yields a large egg bonus.
- **Achievements**: Reach egg-laying milestones to unlock achievements. Claim them in the "Achievements" tab for a one-time egg reward.
- **Animated Feedback**: The UI is full of fun, lively animations, from falling eggs to floating text, enhancing the player experience.
- **Cross-Platform**: Built with Expo, the game runs on iOS, Android, and the web from a single codebase.
