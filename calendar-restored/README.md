# Calendar Frontend

React/Vite frontend for a Google Calendar-like scheduling interface. The current version focuses on the visual layer and frontend UX, with an in-memory mock API that can later be replaced by a real backend.

## Features

- Week view with time grid
- Month view
- Event cards
- Event details panel
- Create event modal
- Edit existing event
- Drag-and-drop between days in week view
- Mock API layer prepared for backend replacement

## Project structure

- `src/App.tsx` - main calendar screen and interactions
- `src/api/calendarApi.ts` - mock API adapter
- `src/mockEvents.ts` - initial event data
- `src/date.ts` - date helpers
- `src/types.ts` - shared event/view types
- `src/styles.css` - full UI styling

## Run locally

This environment did not have `node` or `npm`, so the app was prepared manually and not executed here.

Once Node.js is installed:

```bash
npm install
npm run dev
```

## Next backend integration step

Replace the functions in `src/api/calendarApi.ts`:

- `listEvents()`
- `createEvent()`
- `updateEvent()`

with real HTTP requests to your backend.
