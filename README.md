# SmartSlot

SmartSlot is a full-stack appointment booking platform built with Next.js.
It supports two primary roles:

- **Creators (businesses/providers)** create appointment forms, generate slots, share booking links, and manage incoming bookings.
- **Guests (customers)** book available slots and view their booked appointments.

## Features

- Google-based authentication using Better Auth
- Creator dashboard for appointment forms
- Form builder with:
  - title/description
  - date and time window
  - slot duration, gap, and count
  - optional per-slot blocking
  - active/inactive toggle
- Public booking page via shareable link (`/book?form=<slug>`)
- Slot reservation with conflict-safe booking flow
- Creator view of bookings per form
- Guest “My bookings” dashboard
- Phone-number capture after login

## Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript
- **Styling/UI:** Tailwind CSS, shadcn-style UI components, Lucide icons, Framer Motion
- **Auth:** Better Auth (Google provider)
- **Database:** Neon Postgres + Drizzle ORM
- **HTTP client:** Axios

## Project Structure

```text
src/
  app/
    api/
      appointments/
      auth/[...all]/
      bookings/me/
      phone/
    book/
    bookings/
    create/
    login/
    options/
  components/ui/
  db/
  lib/

drizzle/
drizzle.config.ts
```

## Environment Variables

Create a `.env` file in the project root:

```bash
DATABASE_URL=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Variable Notes

- `DATABASE_URL`: Postgres connection string (Neon)
- `BETTER_AUTH_URL`: server-side auth base URL
- `NEXT_PUBLIC_BETTER_AUTH_URL`: client-side auth base URL
- `NEXT_PUBLIC_APP_URL`: fallback origin for generated share links
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Google OAuth credentials

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3) Lint

```bash
npm run lint
```

### 4) Production build

```bash
npm run build
npm run start
```

## Database / Drizzle

Drizzle is configured via `drizzle.config.ts` and reads `DATABASE_URL`.

Common commands:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Main App Routes

- `/` – landing page
- `/login` – sign in
- `/options` – role selection and phone capture
- `/create` – creator dashboard
- `/create/form` – create appointment form and slots
- `/create/bookings?slug=<slug>` – creator bookings view for a form
- `/book?form=<slug>` – public booking page
- `/bookings` – guest’s booked slots

## API Routes

- `GET/POST /api/auth/[...all]` – Better Auth handler
- `GET /api/phone` – fetch current user phone
- `POST /api/phone` – upsert current user phone
- `GET /api/appointments` – list creator forms
- `POST /api/appointments` – create form + slots
- `GET /api/appointments/[slug]` – public form details
- `GET /api/appointments/[slug]/slots` – available slots (optional `?date=YYYY-MM-DD`)
- `POST /api/appointments/[slug]/book` – create booking
- `GET /api/appointments/[slug]/my-booking` – current user booking for a form
- `GET /api/appointments/[slug]/bookings` – creator-only bookings for a form
- `GET /api/bookings/me` – all bookings for current guest

## Data Model (high level)

- Auth tables: `user`, `session`, `account`, `verification`, `phone_number`
- Booking tables:
  - `appointment_form`
  - `appointment_slot`
  - `appointment_blocked_slot`
  - `appointment_booking`

## Notes

- This project currently does not define automated test scripts in `package.json`.
- Authentication/session cookies are configured to be secure in production.
