# Development Guide

## Install

```bash
npm install
```

## Available Commands

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo development server |
| `npm run web` | Start the Web development server |
| `npm run ios` | Start the iOS target |
| `npm run android` | Start the Android target |
| `npm run build` | Export the Web app and patch the viewport |
| `npm exec -- tsc --noEmit` | Run the TypeScript compiler without emitting files |
| `node scripts/test_currency.js` | Manually check the exchange-rate API |
| `node scripts/test_supabase.js` | Manually query sample Supabase ZIP rows |

## Local Development Checklist

1. Install dependencies.
2. Start the Expo server.
3. Test the Web target when changing browser-specific behavior.
4. Test a native target when changing location permissions or touch interactions.
5. Run the TypeScript check.
6. Run the Web build before committing.
7. Inspect `git status` to confirm that only intended files changed.

## TypeScript and Build Validation

```bash
npm exec -- tsc --noEmit
npm run build
```

The Web build creates `dist/`, which is ignored by Git.

## Tax-Rate Testing

When changing tax logic, test all of the following cases:

- A ZIP Code with a Supabase record
- A ZIP Code without a Supabase record
- A ZIP+4 value such as `92604-1234`
- A valid 0% state
- A failed API request
- A missing or malformed API response
- A decimal rate such as `0.0875`

Check both the displayed percentage and the calculated dollar tax.

## Location Testing

Location behavior depends on permission and platform support. Test at least these states:

- Permission granted
- Permission denied
- No reverse-geocoding result
- Web fallback to OpenStreetMap
- Missing State
- Missing ZIP Code

Do not assume that browser geolocation and native GPS return identical reverse-geocoding fields.

## Currency Testing

The exchange-rate service returns `0` when the request fails. When testing the UI, verify that a failed exchange-rate request does not look like a successful conversion to `₩0`.

## Code Organization Rules

- Keep external API calls in `services/` or `api/` rather than inside presentation components.
- Keep calculation behavior explicit and testable.
- Preserve the decimal-versus-percentage convention for tax data.
- Avoid committing credentials or local environment files.
- Update the relevant documentation when changing data flow or deployment behavior.

## Before Commit

```bash
npm exec -- tsc --noEmit
npm run build
node scripts/test_currency.js
git status --short
```

There is currently no `test` script or automated unit-test suite in `package.json`. Manual checks should be treated as smoke tests, not a replacement for automated coverage.
