# hashChat

hashChat is a cross-platform mobile prototype for age-appropriate adolescent sexual and reproductive health information, aimed at Ghanaian teens, including teens with a visual or hearing disability. Built with Expo and React Native by Samuel Mensah ([@simiel](https://github.com/simiel)), it collects a short on-device profile and sends a text conversation to OpenAI under a fixed system prompt written for that audience. The npm package name is `hashchat`.

## Features

- **Landing screen.** `app/index.tsx` shows the #Chat mark, the line “Empower Your Mind: AI Support for Teens,” and a button that opens the text chat. Tapping the hero navigates to `/voice`.
- **Onboarding.** `app/onboarding.tsx` collects age, disability (`none`, `visual`, or `hearing`), and gender with `react-hook-form` and `@react-native-picker/picker`. Submit writes `onboardingCompleted` and `userData` to AsyncStorage.
- **Onboarding gate.** `app/_layout.tsx` reads `onboardingCompleted` before choosing the root stack, loads Raleway and Space Mono, and holds the splash screen until those fonts are ready.
- **Text chat.** `app/text.tsx` keeps a transcript of `user`, `system`, and `assistant` messages, renders user and assistant bubbles, scrolls to the latest message, and persists the transcript under the AsyncStorage key `messages`.
- **Assistant prompt.** The first message is a system prompt: an expert on Ghanaian adolescent sexual and reproductive health who gives safe, concise, precise, relevant, age-appropriate answers to adolescents who are visually or hearing impaired. The saved age, disability, and gender stay in AsyncStorage; the chat screen does not read them.
- **Model call.** The screen calls `gpt-3.5-turbo-16k` through the official OpenAI SDK with `max_tokens` 150, `n` 1, and `temperature` 0.7. The call is made from the app. This repository has no backend.

## Tech stack

| Area | Choice |
| --- | --- |
| App | Expo SDK 51, React Native 0.74, React 18, TypeScript (strict) |
| Navigation | Expo Router 3, file-based routes, typed routes enabled |
| Styling | NativeWind 2 and Tailwind CSS 3, plus React Native `StyleSheet` |
| Forms | react-hook-form, `@react-native-picker/picker` |
| On-device storage | `@react-native-async-storage/async-storage` |
| Model client | `openai` 4.x |
| UI runtime | react-native-reanimated, expo-font, expo-splash-screen, `@expo/vector-icons` |
| Builds | EAS Build (`eas.json`) |
| Tests | Jest with the `jest-expo` preset |

`app.json` targets portrait iOS (tablets included), Android package `com.simiel.hashChat` with `RECORD_AUDIO`, and static web output through Metro. The URL scheme is `myapp`.

These packages are declared and have no imports in the current screens: `@react-native-voice/voice`, `@react-native-community/voice`, `react-native-voice`, `expo-speech`, `expo-stt`, `react-native-tts`, `natural`, and `axios`. iOS microphone and speech-recognition usage strings in `app.json` are commented out, as are the `expo-stt` and voice config plugins.

## Project structure

```
app/
  _layout.tsx        Root stack, font loading, onboarding gate
  index.tsx          Landing screen
  onboarding.tsx     Age, disability, and gender
  text.tsx           OpenAI text chat
  test.tsx           Placeholder screen
  +not-found.tsx     Unmatched route
  (tabs)/            Starter Home and Explore tabs; the root layout does not mount them
components/
  navigation/TabBarIcon.tsx
constants/Colors.ts  Light and dark colors from the Expo starter
data/data.json       Three sample question/response pairs; no current screen imports them
assets/              App icons, hashtag artwork, microphone media, Raleway and Space Mono
scripts/reset-project.js
eas.json             EAS Build profiles
```

Path alias `@/*` maps to the repository root (`tsconfig.json`). NativeWind is enabled in `babel.config.js`, and `tailwind.config.js` registers the Raleway and Space Mono families.

After onboarding, `onboarding.tsx` calls `navigation.navigate('Home')`. The landing screen routes to `/text` and `/voice`. There is no `app/voice.tsx` in the working tree.

## Getting started

### Prerequisites

- Node.js 18 or newer and npm. Expo SDK 51 requires Node 18+.
- [Expo Go](https://expo.dev/go), or an Android emulator, iOS Simulator, or a web browser.
- An OpenAI API key if you want the text chat to answer.

`npm run ios` and `npm run android` run `expo run:ios` and `expo run:android`, which need a local Xcode or Android Studio toolchain. `npm start` can open the JavaScript bundle in Expo Go without that toolchain.

### Install

```bash
npm install
```

### Configuration

The app does not read environment variables. There is no `.env` file and no `process.env` usage.

The OpenAI client in `app/text.tsx` is constructed with an API key written in that file. Replace that literal with your own key before sending a message. Keep the key out of git. A key is already present in the committed source; treat it as exposed and rotate it in the OpenAI dashboard.

Onboarding answers and chat transcripts remain on the device (`userData`, `onboardingCompleted`, `messages`).

### Run

```bash
npm start
```

`npm start` runs `expo start`. From that dev server you can open Android, iOS, or the web. The same targets have scripts:

```bash
npm run android
npm run ios
npm run web
```

`npm run web` runs `expo start --web`.

### Test and lint

```bash
npm test
npm run lint
```

`npm test` runs `jest --watchAll`. The checked-in test, `components/__tests__/ThemedText-test.tsx`, renders a `ThemedText` component that is not in this repository, so the suite does not match the current screens. `npm run lint` runs `expo lint`.

`npm run reset-project` is the Expo starter reset. It moves `app/` to `app-example/` and writes a blank app. Leave it unused if you want to keep hashChat.

### EAS Build

`eas.json` defines these profiles:

| Profile | Setting |
| --- | --- |
| `preview` | Android APK |
| `preview2` | Android Gradle `assembleRelease` |
| `preview3` | Development client |
| `preview4` | Internal distribution |
| `production` | Empty production profile (EAS defaults) |

`app.json` sets `extra.eas.projectId` for the linked EAS project. No store listing or deployed URL is recorded in the repository.

## Project status

Prototype. Public commits run from 23 June 2024 through 22 July 2024. Nothing in the repo marks it as coursework or a competition entry.

The working tree is the onboarding flow and the text chat. The latest commit, `onboariding`, removed two earlier pieces:

- **Voice chat.** `app/voice.tsx` listened with `@react-native-voice/voice` (`en-US`), spoke replies with `expo-speech`, stored the conversation in AsyncStorage, and sent the transcript to OpenAI. Microphone artwork, the Android `RECORD_AUDIO` permission, and the landing-screen route to `/voice` are still here.
- **Offline retrieval.** `hooks/tfidf.ts` is a small TF-IDF ranker (term frequency, inverse document frequency, query scoring). `hooks/useRecommendation.tsx` indexed `data/data.json`, and `app/offline.tsx` used that hook from a chat-style screen. `data/data.json` is still in the repo: three programming Q&A pairs about Express uploads, MongoDB with Mongoose, and JWT. It is sample data, and no current screen imports it.

`app/(tabs)` and the Jest snapshot are leftovers from `create-expo-app`.

## What this demonstrates

- A mobile product shaped around a specific audience, with the model constrained by a written system prompt for safe, age-appropriate adolescent health answers.
- A multi-turn chat client on device: transcript state, separate user and assistant bubbles, and AsyncStorage so the conversation survives a reload.
- An onboarding form with controlled inputs and a root layout that branches on a stored completion flag, including custom font loading and splash-screen control.
- File-based navigation with Expo Router and typed routes, styled with NativeWind on iOS, Android, and web, plus an EAS Build config for preview APKs, internal distribution, and production.
- In git history, speech recognition and speech playback wired into the same chat loop, and a from-scratch TF-IDF ranker used as an offline retrieval hook.
