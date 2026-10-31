# Digital Ustaad

**Team TUBS · Build4Better 2026**

Digital Ustaad is an interactive, accessible smartphone practice app that helps Pakistani parents and grandparents learn everyday digital tasks independently — starting with sharing a family photo.

## Problem

Many older adults want to stay connected with family on smartphones, but everyday actions (opening Gallery, choosing a photo, sharing it) can feel confusing or risky. Learning on a real phone can feel stressful, and learners worry about sending something by mistake.

## Solution

Digital Ustaad provides a calm **practice-only smartphone simulator** with:

- Large, readable text and touch-friendly controls
- Guided Practice with simple English + Urdu steps
- Independent Practice without the guide
- Clear results for each practice attempt
- Progress saved only on the learner’s device (LocalStorage)

Nothing real is sent. Contacts and photos are fictional practice assets.

## Target audience

Pakistani parents and grandparents (especially ages 50+) who want patient, private practice before trying the same steps on their own phone.

## Features

- Welcome / onboarding screen
- Learning dashboard with Guided and Independent Practice
- Android-style practice phone (home, Gallery, Share sheet)
- Six fictional illustrated gallery photos
- Fictional contacts: Ammi, Abu, Beti, Family Group
- Guided overlay with highlights and gentle tips (EN + Urdu)
- Independent Practice mode (no guide overlays)
- Results screen with transparent practice-attempt notes
- Reset this attempt / Reset saved progress (with confirmation)
- Practice-only safety messaging throughout

### Screenshots

Add screenshots here before final submission:

1. Welcome screen  
2. Dashboard with Guided + Independent Practice  
3. Practice phone Gallery  
4. Share sheet with practice contacts  
5. Results screen  

Suggested filenames: `docs/screenshots/welcome.png`, `dashboard.png`, `gallery.png`, `share.png`, `results.png`.

## Tech stack

- React (JavaScript)
- Vite
- Tailwind CSS v4
- Lucide React
- Framer Motion
- LocalStorage (no backend)

## Installation and local setup

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

Other useful commands:

```bash
npm run lint
npm run build
npm run preview
```

## AI tools and third-party credits

- **Cursor** — AI-assisted coding during the hackathon build window
- **Vite / React / Tailwind / Lucide / Framer Motion** — open-source libraries as listed in `package.json`
- Gallery images are original SVG illustrations created for this project (not real photographs)

## Limitations and simulated functionality

- This is a **simulator**, not a bridge to a real phone OS
- Gallery photos are fictional illustrations
- Contacts are fictional and never connected to a real address book
- Share / Confirm never sends messages, uploads files, or calls external APIs
- Progress metrics describe a practice attempt only — they do **not** prove real-world digital literacy
- “Coming soon” lessons on the dashboard are placeholders

## Team

**TUBS** — Build4Better 2026

## Demo script

See [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md) for a concise under-2-minute video narration.

## Submitted commit

Final submitted commit identifier: `REPLACE_WITH_FINAL_COMMIT_SHA`

After your last commit, run `git rev-parse --short HEAD` and replace the placeholder above.
