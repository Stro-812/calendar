# Trainer List

Redesign of the `s10.run/trainerlist` page. This is a **self-contained** Vite + React + TypeScript
project, set up the same way as `calendar-restored/` so it stays fully isolated — building or
running it does not touch the root app or the calendar.

## Status

Scaffold + working baseline UI on mock data. The content model (a trainer catalog with cards,
filters, search, sorting) is a **placeholder** and should be aligned with the real page once the
data model is confirmed.

## Project structure

- `src/App.tsx` — page shell, filter state, data loading
- `src/components/TrainerCard.tsx` — single trainer card
- `src/components/FilterBar.tsx` — search / specialization / sort / availability controls
- `src/api/trainerListApi.ts` — in-memory mock API (replace with real HTTP calls)
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
