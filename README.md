# HMMS Monorepo (Single Root Repo)

This repository contains three apps in a single root repo:

- `backend/` — Node.js + Express + Prisma API
- `web/` — React + Vite web portal
- `mobile/` — React Native (Expo) app

## Structure

```
backend/
mobile/
web/
```

## Root Scripts

Run these from the repo root:

- `npm run backend` — start backend in dev mode
- `npm run backend:build` — build backend
- `npm run backend:start` — start backend from `dist`
- `npm run web` — start web dev server
- `npm run web:build` — build web
- `npm run mobile` — start Expo
- `npm run mobile:android` — run Expo Android
- `npm run mobile:ios` — run Expo iOS
- `npm run mobile:web` — run Expo Web

## Local Setup

Install dependencies per app:

```
cd backend && npm install
cd ../web && npm install
cd ../mobile && npm install
```
