# Deployment Guide

## Web Build

Build the Expo Web application with:

```bash
npm run build
```

The command runs:

```text
expo export -p web
node scripts/fix-viewport.js
```

The output is written to:

```text
dist/
```

The `dist/` directory is ignored by Git and should be generated as part of deployment or CI.

## Vercel

The project uses `vercel.json` with `dist/` as the output directory.
The Vercel deployment must serve both:

- The exported static Web application
- The `/api/tax-rate` serverless route

After deployment, verify the API route directly:

```text
https://<your-domain>/api/tax-rate?zip=<zip-code>
```

## Environment Variables

Configure these variables in the Vercel project settings:

```text
SUPABASE_URL
SUPABASE_KEY
```

The API route reads these values server-side. Do not commit real credentials to the repository.

## Supabase Setup

Create the table in the Supabase SQL Editor:

```sql
create table tax_rates (
  zip_code text primary key,
  state text,
  city text,
  combined_rate float
);
```

The API expects `combined_rate` to be stored as a decimal value. For example:

```text
8.75% → 0.0875
```

Load ZIP data with `scripts/seed_taxes.js` when the source CSV data is available.
The script expects CSV files under:

```text
tax_data/TAXRATES_ZIP5/
```

The `tax_data/` directory is ignored by Git, so it must be provided separately.

## Deployment Checklist

- [ ] Run `npm install`.
- [ ] Run `npm exec -- tsc --noEmit`.
- [ ] Run `npm run build`.
- [ ] Confirm `dist/` contains the exported Web app.
- [ ] Configure `SUPABASE_URL` in Vercel.
- [ ] Configure `SUPABASE_KEY` in Vercel.
- [ ] Confirm the Supabase `tax_rates` table exists.
- [ ] Confirm the required ZIP rows are present.
- [ ] Check `/api/tax-rate?zip=...` after deployment.
- [ ] Open the deployed Web app and verify bill, tax, tip, rounding, and currency flows.
- [ ] Test behavior when location permission is denied.
- [ ] Test behavior when an external API is unavailable.

## Troubleshooting

### The API returns 500

Check:

- Vercel environment variables
- Supabase project URL
- Supabase key
- Table name and column names
- Supabase network or service status

### The app displays a state-average rate

Check:

- The ZIP Code shown in the app
- The `/api/tax-rate` response
- Whether the ZIP exists in Supabase
- Whether the API request is failing and triggering client fallback
- Whether the stored `combined_rate` uses decimal units

### The KRW value is missing or zero

Check:

- Frankfurter API availability
- Browser network access
- The response's `rates.KRW` property
- UI handling for an exchange-rate failure
