# Backend

Express + MongoDB API for the language app: Google login, DeepL translation,
a Groq-powered chatbot/word-explainer, saved words, and flashcards.

## Setup

```
npm install
cp .env.example .env   # then fill in real values
npm start               # or: npm run dev (auto-restart on change)
```

Requires a running MongoDB instance (local or Atlas) reachable at `MONGODB_URI`.

## Structure

```
server.js              App bootstrap: middleware, DB connect, route mounting
config/
  db.js                 Mongo connection
  passport.js            Google OAuth strategy
middleware/
  ensureAuthenticated.js  Shared auth guards used by protected routes
models/                  Mongoose schemas
routes/
  auth.js                /auth/*            Google OAuth
  translate.js           /api/translate     DeepL proxy
  chat.js                /api/chat          Groq chatbot proxy
  context.js             /api/context/*     Groq word-explainer
  flashcards.js           /api/flashcards/* Manual, AI, saved-word, and deck flashcards
  savedWords.js           /api/savedwords/* Saved-word CRUD
```
