# Kraft

A content editing tool for influencers: motion/video/graphic templates,
a Brand Kit, licensed music, Stripe subscriptions, and an AI chat assistant.

## What's built right now

- Full Next.js 14 App Router project, Tailwind-styled with a dark/gold "Kraft" theme
- Dashboard, Template gallery (free + Pro tiers), Editor screen, Brand Kit, Billing, Login
- Working chat widget wired to a real API route (`/api/chat`) that calls
  **Claude Haiku 4.5** via the Anthropic API — just add `ANTHROPIC_API_KEY`
- Stripe Checkout route + webhook route, ready to go live the moment you add Stripe keys
- Supabase client + full SQL schema (`supabase-schema.sql`) for auth, brand kits, and projects
- A **demo mode**: with no env vars set, the app still runs end-to-end using an
  in-memory session store (`lib/session-store.tsx`) so you can click through
  every screen, toggle Free/Pro, and test the chat bot as soon as you add just
  the Anthropic key

## Run it locally

```bash
npm install
cp .env.example .env.local   # fill in keys as you get them
npm run dev
```

Open http://localhost:3000 — it works immediately, no keys required, in demo mode.

## Going live, step by step

1. **Anthropic API key** → set `ANTHROPIC_API_KEY` to turn the chat widget on for real.
2. **Supabase** → create a free project at supabase.com, run `supabase-schema.sql`
   in the SQL editor, then set the three `NEXT_PUBLIC_SUPABASE_*` /
   `SUPABASE_SERVICE_ROLE_KEY` env vars. Swap `lib/session-store.tsx`'s demo
   auth for `supabase.auth.getSession()` + a `profiles` row.
3. **Stripe** → create a product/price for the Pro plan, set `STRIPE_SECRET_KEY`
   and `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO`. Register `/api/stripe/webhook` in the
   Stripe dashboard and set `STRIPE_WEBHOOK_SECRET`.
4. **Music licensing** → once a partner agreement (Epidemic Sound / Artlist /
   Soundstripe) is signed, replace `MOCK_TRACKS` in
   `app/editor/[id]/page.tsx` with a real fetch to their search endpoint,
   using `MUSIC_PROVIDER_API_KEY` / `MUSIC_PROVIDER_BASE_URL`.
5. **Rendering** → the Export button in the editor currently simulates a
   render. Replace the `setTimeout` in `app/editor/[id]/page.tsx` with a call
   to a Remotion render pipeline (local Remotion for dev, Remotion Lambda for
   production — see `REMOTION_*` env vars).
6. **Deploy** → push to GitHub, import into Vercel, add all env vars in the
   Vercel dashboard, deploy.

## Admin panel

A full-access admin panel lives at **`/admin`** (redirects to `/admin/login` if not signed in).

**Generated credentials (already in `.env.local`, so login works immediately):**
- Email: `admin@kraft.app`
- Password: `z2NJVx3tfpduTE4s`

Rotate this password before you deploy anywhere public — it's sitting in a
plain-text file was generated for you to get started, not meant to be a
permanent credential. To rotate: change `ADMIN_PASSWORD` in `.env.local` (or
your Vercel project's env vars) to a new value and redeploy. There's no
password reset flow yet since there's only one admin account; if you need
multiple admins with different permission levels, that's a real feature to
build next (see "Not built yet" below).

What the admin panel can do (full access):
- **Overview** — total users, paying users, estimated MRR (demo data for now)
- **Users** — view every user and change any user's plan directly (Free/Pro/Studio)
- **Templates** — add, edit tier (Free/Pro), and delete any template in the catalog

This is protected by `middleware.ts`, which blocks every `/admin` and
`/api/admin` route unless a valid signed session cookie is present. Sessions
last 8 hours. The check compares your password using a constant-time
comparison (`crypto.timingSafeEqual`) to avoid timing attacks.

**Demo-mode limits to know about:** user and template data here lives in an
in-memory store (`lib/adminStore.ts`) that resets whenever the server
restarts, and won't sync across multiple server instances. Before going live,
swap it for real Supabase tables (`profiles` for users, a new `templates`
table instead of the static `data/templates.json`) so admin edits persist and
scale properly.



```
app/
  page.tsx                 dashboard
  templates/page.tsx        template gallery (free/pro gating)
  editor/[id]/page.tsx      editor: fields, music, export
  brand-kit/page.tsx        logo/colors/font, applied globally
  billing/page.tsx          plan comparison + Stripe Checkout
  login/page.tsx            auth (demo + Supabase-ready)
  api/chat/route.ts          Claude Haiku 4.5 chat endpoint
  api/stripe/checkout/route.ts
  api/stripe/webhook/route.ts
components/
  NavBar.tsx, ChatWidget.tsx
lib/
  session-store.tsx  (demo state — swap for real Supabase session)
  supabaseClient.ts, plans.ts
data/templates.json  (mock template catalog)
supabase-schema.sql
```
