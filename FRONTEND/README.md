# Task Manager Frontend

This frontend scaffold is aligned with the documentation stack:

- React + Vite
- TypeScript
- Tailwind CSS
- MUI

## Planned Modules

- Login Management
- City Management
- User Management
- Task Management

## Suggested Flow

1. Install dependencies with `npm install`
2. Start development server with `npm run dev`
3. Connect feature APIs inside `src/services` and `src/features/*/api`
4. Replace placeholder pages with actual forms, grids, and cards

## Folder Map

- `src/app`: app-level providers, theme, layout
- `src/components`: reusable UI building blocks
- `src/features`: feature-based modules from the PDF
- `src/routes`: route constants, guard, router setup
- `src/services`: API client and auth storage helpers
- `src/types`: shared types
- `src/utils`: validation and formatting helpers

## Main Routes

- `/login`
- `/forgot-password`
- `/reset-password/:resetPasswordCode`
- `/invalid-page`
- `/signup`
- `/`
- `/profile`
- `/users`, `/users/create`, `/users/edit/:id`
- `/countries`, `/countries/create`, `/countries/edit/:id`
- `/states`, `/states/create`, `/states/edit/:id`
- `/cities`, `/cities/create`, `/cities/edit/:id`
- `/tasks`, `/tasks/create`, `/tasks/edit/:id`

## Architecture Notes

- Authentication screens are separated under `src/features/auth`
- Admin screens are wrapped in a protected layout with header and sidebar
- Each major documentation module has its own `api`, `pages`, `components`, and `types` area
- Shared skeleton and placeholder components are included because the PDF explicitly asks for skeleton support and common page structures
