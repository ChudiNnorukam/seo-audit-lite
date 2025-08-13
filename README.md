# SEO Audit Lite — Micro‑SaaS Scaffold

Free check: sitemap, robots “Sitemap:” line, and a 5‑image alt‑text sample.

## Run locally
- Serve `public/` (any static server) and proxy `/api/*` to the Worker, or use Cloudflare Pages Functions (native).

## Deploy to Cloudflare Pages (free)
- Create a new Pages project; set `seo-audit-lite` as the root.
- Functions (Node worker) live under `functions/`. Pages will auto‑deploy and route `/api/quick`, `/api/checkout`, `/api/ping-stripe`.

## Stripe (test-first, safe)
- Create Product + recurring Price in Stripe (Test mode). Copy the `price_...` ID.
- Set env vars in Cloudflare Pages → Settings → Environment Variables:
  - `STRIPE_SECRET_KEY` = `sk_test_...` (test key only)
  - `STRIPE_PRICE_ID` = `price_...`
  - `STRIPE_SUCCESS_URL` / `STRIPE_CANCEL_URL` (optional)
- Health check (test mode only): GET `/api/ping-stripe` (blocks live keys)
- Checkout: POST `/api/checkout` → redirects to Stripe Checkout

## Next (Pro plan)
- CSV batch endpoint `/api/batch` → returns scored CSV + zip bundle
- Supabase auth + saved runs
- Stripe webhooks to set plan after Checkout complete
