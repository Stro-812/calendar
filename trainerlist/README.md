# Trainer List

Redesign of the `s10.run/trainerlist` page. This is a **self-contained** Vite + React + TypeScript
project, set up the same way as `calendar-restored/` so it stays fully isolated — building or
running it does not touch the root app or the calendar.

## Status

Redesign prototype on mock data. Implements the UX-audit recommendations:

- **«Что для вас важнее всего?»** — choose up to 3 rating components; counter `N/3`, remaining
  options dim when the limit is reached.
- The list **re-ranks by the selected priorities** (and shows "Отсортировано по вашим приоритетам").
- Each card shows a **numeric score (X.0 / 10)** instead of a row of stars, plus an expandable
  "Из чего складывается рейтинг" breakdown.
- When priorities are chosen, the matching components are **highlighted in the card** with mini bars.
- Cleaner card: 2-line description clamp, labelled discipline chips, clear "Удалённо" tag, single
  price format, "Профиль тренера" action.

Mock data fields are placeholders to be aligned with the real backend model.

## Project structure

- `src/App.tsx` — page shell, filter/priority state, results bar
- `src/components/PriorityPicker.tsx` — "choose up to 3" rating components
- `src/components/Filters.tsx` — disciplines / currency / keywords / tags
- `src/components/TrainerCard.tsx` — trainer card with score + breakdown
- `src/components/ScoreBadge.tsx` — numeric rating badge
- `src/api/trainerListApi.ts` — in-memory mock API with priority-based ranking
- `src/constants.ts` — priority and discipline metadata
- `src/mockTrainers.ts` — placeholder data
- `src/types.ts` — shared types
- `src/styles.css` — all styling

## Run locally

```bash
cd trainerlist
npm install
npm run dev
```

## Next steps

- Confirm the real data model and fields of the page.
- Replace `listTrainers()` in `src/api/trainerListApi.ts` with real backend requests.
- Finalize the visual design.
