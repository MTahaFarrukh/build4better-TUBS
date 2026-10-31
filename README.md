# Digital Ustaad

<p align="center">
  <img src="public/icons/icon-512.png" alt="Digital Ustaad" width="96" height="96" />
</p>

<p align="center">
  <strong>Learn your phone by doing — safely, patiently, in English &amp; Urdu.</strong><br/>
  Team <b>TUBS</b> · Build4Better 2026
</p>

<p align="center">
  <a href="https://digital-ustaad.vercel.app/"><img src="https://img.shields.io/badge/Live%20Demo-digital--ustaad.vercel.app-167D68?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" /></a>
  <a href="#-quick-start"><img src="https://img.shields.io/badge/Quick%20Start-npm%20run%20dev-183B35?style=for-the-badge" alt="Quick Start" /></a>
  <a href="./DEMO_SCRIPT.md"><img src="https://img.shields.io/badge/Demo%20Script-2%20min-F3C15A?style=for-the-badge" alt="Demo script" /></a>
</p>

<p align="center">
  <b>Try it live:</b> <a href="https://digital-ustaad.vercel.app/">https://digital-ustaad.vercel.app/</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PWA-Offline%20ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white" alt="PWA" />
  <img src="https://img.shields.io/badge/Capacitor-7-119EFF?style=flat-square&logo=capacitor&logoColor=white" alt="Capacitor" />
  <img src="https://img.shields.io/badge/Language-EN%20%2B%20Urdu-F3C15A?style=flat-square" alt="EN + Urdu" />
  <img src="https://img.shields.io/badge/Privacy-Practice%20only-2A524A?style=flat-square" alt="Practice only" />
  <img src="https://img.shields.io/badge/Lessons-8%20interactive-E85D4C?style=flat-square" alt="8 lessons" />
</p>

---

## Why Digital Ustaad?

Digital Ustaad is a practice app for Pakistani parents and grandparents who did not grow up with smartphones. Everyday actions feel risky — photos, WhatsApp, bills, scam messages. Static tutorials don’t stick.

**Digital Ustaad** is a calm **practice phone**: learners do the steps themselves. The app does not do the task for them. **Nothing real is ever sent.**

> **استاد کے ساتھ سیکھیں، خود آزمائیں، محفوظ رہیں۔**  
> Learn with Ustaad · Try alone · Stay safe.

---

## Highlights

| | |
|:---|:---|
| **Learn by doing** | Simulated phone + decision lessons — not a wall of text. |
| **Guided + Independent** | Learn with Ustaad first, then try alone. |
| **Urdu + English** | Language gate, RTL, spoken Urdu clips + English speech. |
| **Gamified journey** | Points, stages, streaks, daily bonus, badges. |
| **Privacy first** | Fictional photos/contacts/chats/bills. No accounts. No API keys for core learning. |
| **Installable PWA** | Offline shell after first visit / `npm run build`. |

---

## Learning path — 8 lessons

| # | Badge | Lesson | What you practise |
|:-:|:-----:|:-------|:------------------|
| 1 | Photo | **Share a family photo** | Gallery → pick → Share → family contact |
| 2 | Voice | **Send a voice message** | WhatsApp → hold mic → release to send |
| 3 | Reply | **Send a short reply** | Ammi’s chat → «جی، ٹھیک ہے» |
| 4 | Call | **Make a video call** | Call Beti → hang up (practice UI) |
| 5 | Safety | **Spot a fake message** | Pause → verify → block / report |
| 6 | Saved | **Call the saved number** | Don’t trust a new number asking for money |
| 7 | Link | **Leave a suspicious link** | Don’t open / forward message links |
| 8 | Bill | **Pay a bill safely** | Check name & amount · never share the PIN |

Each lesson: **Learn with Ustaad** → **Try alone** → **Results** (practice feedback only).

Optional: **Follow-Along** real-phone WhatsApp guide (opens WhatsApp on Android; never reads chats).

---

## Quick start

```bash
npm install
npm run dev
```

Open the URL in the terminal (usually `http://localhost:5173`).

| Command | What it does |
|:--------|:-------------|
| `npm run dev` | Local development server |
| `npm run lint` | ESLint |
| `npm test` | Practice-phone + catalog checks |
| `npm run build` | Production build + offline PWA shell |
| `npm run preview` | Preview the production build |
| `npm run test:full` | Tests + rebuild + offline shell check |

**Live deploy:** [https://digital-ustaad.vercel.app/](https://digital-ustaad.vercel.app/)

### Android (optional Follow-Along)

Needs JDK 21+ and Android Studio:

```bash
npm run cap:sync:android
npx cap open android
```

---

## Tech stack

<p>
  <img src="https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Bundler-Vite%206-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Styles-Tailwind%20v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Motion-Framer%20Motion-0055FF?style=for-the-badge" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Icons-Lucide-000000?style=for-the-badge" alt="Lucide" />
  <img src="https://img.shields.io/badge/Storage-LocalStorage-FFB000?style=for-the-badge" alt="LocalStorage" />
  <img src="https://img.shields.io/badge/Mobile-Capacitor%207-119EFF?style=for-the-badge&logo=capacitor&logoColor=white" alt="Capacitor" />
</p>

- No backend for the core experience  
- PWA: `public/manifest.webmanifest` + `scripts/build-pwa.mjs` → `dist/sw.js`  
- Capacitor 7 + small Android plugin to open WhatsApp / WhatsApp Business  

---

## Privacy & Practice Mode

<p>
  <img src="https://img.shields.io/badge/Real%20gallery-Never%20accessed-2A524A?style=flat-square" alt="No gallery" />
  <img src="https://img.shields.io/badge/Real%20WhatsApp-Never%20read-2A524A?style=flat-square" alt="No WhatsApp" />
  <img src="https://img.shields.io/badge/Real%20payments-Never%20sent-2A524A?style=flat-square" alt="No payments" />
  <img src="https://img.shields.io/badge/Accounts-None-2A524A?style=flat-square" alt="No accounts" />
</p>

- Practice Mode labelled throughout  
- Fictional photos, contacts, chats, bills, and scam messages only  
- Progress stays in LocalStorage on this device  
- Coaching is deterministic — not a live AI tutor API  

---

## Honest limitations

| Simulated | Meaning |
|:----------|:--------|
| Voice note | Hold / release UI — no real mic upload |
| Video call | Practice call screen only |
| Bill pay | Practice Wallet — no real money |
| Scam messages | Fictional scenarios |
| Coaching | Scripted Ustaad help |
| Progress | Practice feedback — not a real-world literacy score |

- Website cannot open WhatsApp by itself; Android app can for Follow-Along  
- Urdu speech uses shipped recordings (`public/voice/ur`); English uses the device voice  
- First visit needs internet; after install, lessons + Urdu audio can work offline  

---

## Demo

- **Live app:** [https://digital-ustaad.vercel.app/](https://digital-ustaad.vercel.app/)  
- **Narration:** [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md) (~2 minutes)

Suggested arc: Welcome → learning path → photo share → voice/reply → safety → badges & privacy.

---

## Team & credits

**TUBS — Build4Better 2026**

- Uzair Ahmed  
- Taha Farrukh  
- Bilal Rasheed  

| | |
|:---|:---|
| **Repo** | [MTahaFarrukh/build4better-TUBS](https://github.com/MTahaFarrukh/build4better-TUBS) |
| **Build assist** | Cursor during the hackathon window |
| **Art** | Original SVG gallery illustrations |
| **Urdu voice** | Recordings shipped with the app (built once with Translate speech tooling; app does not call Google during lessons) |
| **Fonts** | Lexend + Noto Nastaliq Urdu |
| **Libraries** | See `package.json` |

---

## Submitted commit

`bc144bde9733ae1f168a619fa19ff0101c03fc99`

---

<p align="center">
  <b>Digital Ustaad</b> — patient smartphone practice for Pakistani families.<br/>
  <sub>Practice Mode · Nothing real is sent · EN + اردو</sub>
</p>
