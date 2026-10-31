# Digital Ustaad

**Team TUBS · Build4Better 2026**

Digital Ustaad is a practice app for Pakistani parents and grandparents who did not grow up with smartphones. It teaches everyday phone tasks in simple English and Urdu. The learner does the steps. The app does not do the task for them.

## Target user and problem

The people this is for are parents and grandparents, especially around age 50 and older. Everyday actions feel risky: sending a photo, a WhatsApp voice note, a video call, a bill payment, or a message that might be a scam. When they get stuck, they call their children. Many avoid the tools that would help them because they are afraid of breaking something or looking foolish.

## Solution and core features

Digital Ustaad is a practice phone plus short lessons. A lesson can be done with Ustaad (step by step) or alone. Points, streak, and lesson progress are saved on that phone only. There is no account and no server.

Lessons:

1. Share a family photo — open Gallery, choose a practice photo, share it with a fictional family contact.
2. Send a voice message — open WhatsApp, open a chat, hold the mic, release to send.
3. Send a short reply — open Ammi’s chat and send «جی، ٹھیک ہے».
4. Make a video call — call Beti on the practice phone, then hang up.
5. Spot a fake message — prize, “new number, send money”, and parcel-fee messages.
6. Call the saved number — when a new number asks for money or a code, call the number already saved.
7. Leave a suspicious link — do not open it and do not forward it.
8. Pay a bill safely — check the name and the amount, and refuse a message that asks for the PIN.

Also included:

- English and real Urdu, including right-to-left layout
- Spoken Urdu from recordings shipped with the app, and English from the phone’s own voice
- Easy (light, larger type) and dark themes
- A results screen with plain-language confidence, plus a way to tell family on WhatsApp
- A separate real-phone guide for a WhatsApp voice note on Android. The guide can open WhatsApp. It never reads chats or checks that a message was sent
- Installable website (PWA) so lessons and Urdu recordings open again without internet after the first visit
- An Android shell with Capacitor for that real-phone guide

Practice lessons use fictional people, photos, bills, and messages. Nothing real is sent, paid, or called.

## Setup and run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

```bash
npm run lint
npm run build
npm run preview
```

`npm run build` also writes the offline service worker.

Android follow-along needs JDK 21+ and Android Studio:

```bash
npm install
npm run cap:sync:android
npx cap open android
```

On a phone with USB debugging:

```bash
adb devices
npm run cap:sync:android
cd android
.\gradlew.bat installDebug
```

## Technology stack

- React 18 and Vite 6
- Tailwind CSS v4
- Framer Motion
- Lucide React
- LocalStorage for language, theme, voice, and progress
- Capacitor 7 and a small Android plugin that opens WhatsApp or WhatsApp Business
- A production service worker for offline use on the web

Dependencies are listed in `package.json`.

## AI tools and third-party credits

- **Cursor** — AI assistance for coding, debugging, and this README during the build
- **React, Vite, Tailwind CSS, Framer Motion, Lucide, Capacitor** — open-source libraries
- **Google Fonts** — Lexend and Noto Nastaliq Urdu, loaded in the browser
- **Google Translate speech** — used once, while building, to record the Urdu lines saved in `public/voice/ur`. The running app plays those files. It does not call Google during a lesson
- Gallery pictures are original SVG illustrations made for this project

## Limitations

- Lessons are practice. They do not send a real message, place a real call, or move real money
- The real-phone WhatsApp guide opens the app only. The learner does every step and confirms when they are done
- The website cannot open WhatsApp by itself. That launch exists in the Android app
- Progress stays on one browser or installed app. Clearing site data removes it. There is no login and no shared family dashboard
- Urdu speech is the shipped recordings. A changed Urdu sentence needs a new recording (`node scripts/build-urdu-voice.mjs`)
- English speech uses whatever English voice the phone already has
- The first visit needs internet to download the app and the fonts. After a home-screen install, lessons and Urdu audio work offline. Fonts may fall back to the phone’s own type
- There is no lesson for a banking app signing the user out, or for a government form

## Team

**TUBS** — Build4Better 2026

Names recorded in this repository’s history: MTahaFarrukh, UzairAhmed87, and sjameel06.

## Submitted commit

Final submitted commit identifier: `6d5d241369c927a23e04f9aaca515ecabe121fc3`

That commit contains the app and this README. The commit after it only writes this identifier.
