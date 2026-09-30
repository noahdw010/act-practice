# ACT Practice

A local React + TypeScript app for practicing ACT-style questions across all four
sections: English, Math, Reading, and Science.

## Modes

- **Untimed Practice** — no clock; instant feedback and an explanation after every question.
- **Timed Quiz** — a single section, paced at the official ACT rate (questions × official minutes/section).
- **Full Simulated Test** — all four sections back-to-back in official order, each timed the same way.

Progress (score, section breakdown, and time spent) is saved to `localStorage` after every
completed session and viewable on the **Progress History** page, including a trend chart of
score over time.

## Running it

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

## Adding questions

Question banks live in `src/data/questions/<section>.ts`. Reading and Science questions
reference a `passageId` pointing at a passage/data table defined in `src/data/passages/`.
Each `Question` needs a `prompt`, `choices`, `answerIndex`, `explanation`, and `skill` tag.
Section timing (question count / minutes) is configured in `src/data/sectionMeta.ts` and
automatically drives the timed-mode pacing regardless of how many questions are in the bank.

## Stack

Vite, React 19, TypeScript, React Router, Tailwind CSS. No backend — all state is local
(in-memory during a session, `localStorage` for history).
