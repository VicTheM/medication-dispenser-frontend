# MedAdhere Frontend

React + TypeScript + Vite single-page app: the public landing page, caregiver
dashboard, and patient portal for the MedAdhere API.

## Run it

```bash
npm install
cp .env.example .env    # point VITE_API_BASE_URL at your backend
npm run dev             # http://localhost:5173
```

Build for production: `npm run build` → outputs to `dist/`, deploy as static
files behind any web server / CDN (Netlify, Vercel, S3+CloudFront, nginx...).

## Structure

```
src/
  api/            fetch client + TypeScript types mirroring the backend schemas
  context/        AuthContext (JWT session), ToastContext (feedback messages)
  components/     CompartmentStrip (signature A-G visual, reused everywhere),
                  AppShell (sidebar layout), AskAI (assistant widget), Shared
                  (Modal, StatusBadge, ProtectedRoute, etc.)
  pages/
    Landing.tsx           marketing page
    Login.tsx / Register.tsx
    caregiver/
      Dashboard.tsx        patient list + enrolment
      PatientDetail.tsx    every admin tab: medications, schedule, device,
                           dispense logs, adherence videos, telemetry,
                           voice history, notifications
      Knowledge.tsx        feed the AI local documents
    patient/
      Portal.tsx           read-only mirror: today / history / notifications
```

## Design

- **Signature element**: the `CompartmentStrip` component (A–G) is the one
  visual idea used everywhere — animated in the landing hero, clickable as
  the actual schedule editor, and a read-only "today" view in the patient
  portal. One motif, three real jobs, tied directly to the physical hardware.
- **Palette / type**: defined as CSS custom properties in
  `src/styles/tokens.css` — change those to re-theme the whole app. Display
  face is Fraunces (headlines only), body is Inter, data/IDs/timestamps use
  IBM Plex Mono.
- Respects `prefers-reduced-motion`, all interactive elements have visible
  keyboard focus, and layouts collapse to a single column under ~900px.

## Auth model

- Two roles: `caregiver` and `patient`. `AuthContext` stores the JWT in
  `localStorage` and exposes `loginCaregiver`, `registerCaregiver`,
  `loginPatient`, `logout`.
- `ProtectedRoute` gates `/app/*` to caregivers and `/portal/*` to patients —
  it doesn't just hide UI, every write action still relies on the backend's
  own role enforcement (patients get a 401 from any caregiver-only route
  regardless of what the frontend shows).

## Known simplifications (documented, not hidden)

- Adherence video **files** aren't previewed inline — the backend returns
  metadata (`file_path`, duration, etc.) since it doesn't yet expose a
  streaming endpoint for them. The Videos tab shows this and explains why;
  wire a static/CDN route in front of the backend's storage volume to enable
  in-browser playback.
- No real-time push in the UI yet — dashboard data is fetched on page load /
  tab switch, not live-updated via WebSocket. Add polling or a small
  WebSocket subscription if you want the caregiver dashboard to update the
  instant a dispense event comes in.
