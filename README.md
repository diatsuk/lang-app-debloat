# Language Learning App

A React frontend (`langdiploma/`) and Express/MongoDB backend (`backend/`) for
translating text, chatting with an AI tutor, explaining words in context, and
building flashcards.

## Run locally

```
# Terminal 1 — backend
cd backend
npm install
cp .env.example .env   # fill in MongoDB URI, Google OAuth, DeepL, Groq keys
npm start               # http://localhost:5000

# Terminal 2 — frontend
cd langdiploma
npm install
cp .env.example .env    # only needed if the backend isn't on localhost:5000
npm start                # http://localhost:3000
```

See `backend/README.md` for details on the API structure.

## What changed in this cleanup

- Removed a full Windows Node.js binary distribution (~190 MB) that had been
  installed into `backend/` as npm "dependencies" (`corepack`, `npm`) —
  this is also why `backend/README.md`, `CHANGELOG.md`, and `LICENSE` were
  Node.js's own docs instead of the project's.
- Removed all `node_modules` folders and a duplicate root `package.json`
  that wasn't used anywhere (run `npm install` in each app folder to restore).
- Split the 351-line `backend/server.js` into `config/`, `middleware/`,
  and one file per route; removed a route (`context.js`) and helper function
  that were duplicated verbatim in two places.
- Fixed two filename/require mismatches in `backend/models/` that would have
  broken on case-sensitive filesystems (Linux/Mac) or thrown on load.
- Centralized the frontend's backend URL into `src/api.js` instead of
  hardcoding `http://localhost:5000` in seven different files.
- Removed two dead frontend files (`Dummy.js`, `Chatbotnew.js`) that weren't
  reachable from any route.

No API endpoints, request/response shapes, or user-facing behavior changed.
