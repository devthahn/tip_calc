# Tip Calculator

Tip Calculator is a cross-platform restaurant bill calculator built with Expo and React Native.
It helps users estimate tax, tip, the final USD total, and the equivalent KRW amount while dining in the United States.

The app targets Web, iOS, and Android.

## Features

- Enter a food or bill amount
- Enter tax as either a dollar amount or a percentage
- Detect the user's location and ZIP Code when permission is granted
- Look up ZIP-based tax rates through a Vercel API and Supabase
- Fall back to local ZIP and state-average tax data
- Adjust the tip percentage with a slider
- Disable or re-enable the tip
- Round the final total by adjusting the tip
- Convert the USD total to KRW using a live exchange rate
- Run as an Expo web, iOS, or Android application

## Technology Stack

- Expo 54
- React 19
- React Native 0.81
- React Native Web
- TypeScript
- Supabase
- Vercel Serverless Functions
- Frankfurter Exchange Rate API
- Expo Location
- OpenStreetMap Nominatim (web geocoding fallback)

## Getting Started

### Requirements

- Node.js
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm start
```

Run a specific platform with:

```bash
npm run web
npm run ios
npm run android
```

### Type-check the project

```bash
npm exec -- tsc --noEmit
```

### Build the web application

```bash
npm run build
```

The web build is exported to `dist/`. The build command also applies the project-specific viewport adjustment in `scripts/fix-viewport.js`.

## Project Structure

```text
.
├── App.tsx                    # Main screen, application state, and calculations
├── index.ts                   # Expo application entry point
├── components/
│   ├── ResultCard.tsx         # Bill, tax, tip, total, and KRW display
│   ├── TipDial.tsx            # Circular tip control (currently not used by App.tsx)
│   └── TipSlider.tsx          # Tip percentage slider and no-tip toggle
├── services/
│   ├── CurrencyService.ts     # USD/KRW exchange-rate request
│   ├── LocationService.ts     # Permission, GPS, and reverse geocoding
│   └── TaxService.ts          # ZIP/state tax-rate lookup and fallbacks
├── api/
│   └── tax-rate.ts            # Vercel API route backed by Supabase
├── scripts/
│   ├── fix-viewport.js        # Post-build web viewport adjustment
│   ├── schema.sql             # Supabase table definition
│   ├── seed_taxes.js          # Import tax-rate CSV data into Supabase
│   ├── test_currency.js       # Manual exchange-rate check
│   └── test_supabase.js       # Manual Supabase query check
├── assets/                    # Application icons and images
├── app.json                   # Expo configuration
├── tsconfig.json              # TypeScript configuration
├── vercel.json                # Vercel deployment configuration
└── package.json               # Dependencies and npm scripts
```

## Calculation Model

The app calculates the bill using the following model:

```text
Tax   = food cost × (tax rate / 100)
Tip   = food cost × (tip percentage / 100)
Total = food cost + tax + tip
```

Tax and tip are calculated from the food cost, not from the food cost plus tax.

## Tax-Rate Lookup

The current lookup flow is:

1. Request the user's current location.
2. Extract the State and ZIP Code from reverse geocoding.
3. Request `/api/tax-rate?zip={ZIP}`.
4. The API queries the Supabase `tax_rates` table.
5. If the API request fails, the client tries its local ZIP map.
6. If no local ZIP value is available, the client uses a state-average value.

The state-average values are estimates. They are not authoritative store-level tax rates and can differ from the rate charged at a specific restaurant.

The API response is expected to contain a decimal rate. For example:

```text
0.0875 → 8.75%
0.0885 → 8.85%
```

See [docs/tax-rate.md](docs/tax-rate.md) for the complete data flow, units, and limitations.

## External Services and Environment Variables

### Supabase

The Vercel API route reads the following server-side environment variables:

```env
SUPABASE_URL=...
SUPABASE_KEY=...
```

Do not commit real credentials. Use local environment configuration or the Vercel project settings.

### Frankfurter

The currency service requests the latest USD/KRW exchange rate from:

```text
https://api.frankfurter.app/latest?from=USD&to=KRW
```

### Location Services

- Native platforms use Expo Location.
- Web uses Expo Location when available and may fall back to OpenStreetMap Nominatim.

## Deployment

Build the web app with:

```bash
npm run build
```

Deploy the generated `dist/` directory through Vercel. Configure `SUPABASE_URL` and `SUPABASE_KEY` in the Vercel project environment variables.

See [docs/deployment.md](docs/deployment.md) for the deployment checklist.

## Validation Commands

The following commands are useful before committing changes:

```bash
npm exec -- tsc --noEmit
npm run build
node scripts/test_currency.js
```

There is currently no automated unit-test suite in `package.json`; the script checks are manual smoke tests.

## Known Limitations

- State-average tax values can differ from the actual tax rate for a restaurant's address.
- ZIP-level accuracy depends on the contents and units of the Supabase data.
- Location features depend on browser or device permission.
- The currency display depends on the availability of the Frankfurter API.
- The relative `/api/tax-rate` URL is designed for the deployed web application; native builds may require a different API base URL.
- `TipDial.tsx` exists as an alternative UI component but is not currently rendered by `App.tsx`.
- Tax, location, and exchange-rate requests do not currently expose detailed error states in the UI.

## Documentation

- [Architecture](docs/architecture.md)
- [Tax-rate data and fallback rules](docs/tax-rate.md)
- [Development guide](docs/development.md)
- [Deployment guide](docs/deployment.md)
