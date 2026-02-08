# Heyana Web (Next.js)

Next.js web app for the Heyana Objects system. It talks to the [NestJS API](../heyana-backend) and shows the list of objects, create form, and object detail. Updates appear in **real time** via Socket.IO when objects are created or deleted (e.g. from the mobile app).

---

## Quick start

1. **Backend**

   The API (and Socket.IO) must be running. See [heyana-backend/README.md](../heyana-backend/README.md).

2. **Environment**

   Copy `.env.local.example` to `.env.local` and set:

   - `NEXT_PUBLIC_API_URL` — e.g. `http://localhost:3000` (same as the NestJS server)

3. **Run**

   ```bash
   npm install
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) for the web app. If the backend already uses port 3000, run the web app on another port: `PORT=3001 npm run dev`, then open http://localhost:3001.

---

## Features

- **List objects** — Home page fetches `GET /objects` and shows cards (image, title, description). Click a card to open the detail page.
- **Create object** — `/create`: form with title, description, and image file; submits to `POST /objects` (multipart). On success, redirects to home.
- **View single object** — `/objects/[id]`: shows one object with image, title, description, createdAt, and a Delete button.
- **Delete object** — On the detail page, Delete calls `DELETE /objects/:id` then redirects to home.
- **Real-time updates** — Socket.IO client connects to the API URL and listens for `object:created` and `object:deleted`. The list page updates automatically when something is created or deleted (e.g. from another tab or the mobile app).

---

## Project structure

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Home: list of objects + Socket.IO updates
├── create/
│   └── page.tsx        # Create object form
└── objects/
    └── [id]/
        └── page.tsx    # Single object detail + delete

components/
└── ui/                 # Reusable UI (button, input, card, label) — shadcn-style with Tailwind

hooks/
└── use-objects-socket.ts   # Socket.IO hook: connect to API, listen for object:created / object:deleted

lib/
├── api.ts              # REST client: getObjects, getObject, createObject, deleteObject
└── utils.ts            # cn() for class names

types/
└── object.ts           # ObjectItem type (matches API response)
```

---

## API usage

- **Base URL:** `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:3000`).
- **List:** `GET /objects` → array of objects.
- **One:** `GET /objects/:id` → single object.
- **Create:** `POST /objects` with `multipart/form-data`: `title`, `description`, `image` (file).
- **Delete:** `DELETE /objects/:id`.

Images are shown via the `imageUrl` returned by the API (Supabase Storage public URLs).

---

## Real-time (Socket.IO)

- The app connects to the same host as the API (`NEXT_PUBLIC_API_URL`).
- **Events:**
  - `object:created` — payload is the new object; list page prepends it.
  - `object:deleted` — payload is `{ id }`; list page removes that item.

So if you create an object on the mobile app (or another browser), the web list updates without a refresh.

---

## UI stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**.
- **Tailwind CSS v4** for styling.
- **shadcn-style components** in `components/ui` (Button, Input, Card, Label) implemented with Tailwind and `clsx` / `tailwind-merge` (no full shadcn CLI run). You can later run `npx shadcn@latest init` and add more components if needed.

---

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production build

---

## Interview-style notes

- **Why Next.js App Router?** Single codebase, file-based routes (`app/page.tsx`, `app/create/page.tsx`, `app/objects/[id]/page.tsx`), and easy client components with `"use client"` where we need state and effects.
- **Why fetch in client components?** List, create, and detail all need browser-side state (loading, error, form data) and/or effects (fetch on mount, Socket listeners). So we use `"use client"` and fetch from `lib/api.ts` with `NEXT_PUBLIC_API_URL`.
- **Why a custom Socket hook?** `useObjectsSocket` centralizes connection and event handling and keeps the list page simple: pass callbacks to add/remove items from state when events fire.
- **CORS:** The NestJS backend must allow the web origin (e.g. `http://localhost:3001`). Socket.IO gateway is configured with `cors: { origin: '*' }` for local dev; for production you’d restrict to your app’s origins.
