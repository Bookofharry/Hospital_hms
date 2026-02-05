# Hospital Maintenance Management System (HMMS) - Project Brief

## Overview
HMMS is a centralized platform for managing hospital maintenance operations including work orders, asset tracking, preventive maintenance, inventory, and reporting. It aims to reduce equipment downtime and improve compliance.

## Core Stack
- **Backend:** Node.js, Express, PostgreSQL, Prisma ORM
- **Web Portal:** React, Vite, TailwindCSS, Shadcn UI
- **Mobile App:** React Native (Expo), NativeWind

## Key Features (Phase 1)
- **RBAC:** Admin, Manager, Technician roles
- **Work Orders:** Request, Assign, Track, Close
- **Assets:** Registry with QR code scanning
- **Dashboard:** Real-time visibility

## Architecture
- Monorepo-style structure: `backend`, `web`, `mobile`
- REST API with JWT Authentication
- Real-time updates via Socket.io/FCM



