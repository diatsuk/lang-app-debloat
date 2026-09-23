# Language Learning App

A full-stack web application that helps users learn a new language through
AI-generated practice and instant translation.

## Features
- **AI-powered learning:** uses the OpenAI API to [generate exercises / give
  feedback / hold practice conversations, pick what applies]
- **Accurate translation:** integrates the DeepL API for [word/sentence]
  translations
- **Secure sign-in:** Google OAuth authentication
- **Persistent progress:** user data stored in MongoDB, [e.g. saved vocabulary,
  progress tracking]

## Tech Stack
- **Frontend:** React
- **Backend:** Node.js (Express)
- **Database:** MongoDB
- **APIs:** OpenAI, DeepL, Google OAuth

## Getting Started
1. Clone the repo
2. Run `npm install` in both `/frontend` and `/backend`
3. Add a `.env` file with your `OPENAI_API_KEY`, `DEEPL_API_KEY`,
   `MONGODB_URI`, and Google OAuth credentials
4. Run `npm start` in frontend
5. Run `node server.js` in backend
