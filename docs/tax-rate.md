# Tax-Rate Data and Fallback Rules

## Purpose

The tax service estimates the sales-tax rate for the user's current location.
It is intended to make bill entry faster, not to replace an official tax-rate source or the tax printed on a receipt.

## Lookup Priority

The current implementation follows this general priority:

```text
Supabase ZIP rate
        ↓ if the API request fails or does not provide a usable rate
Local ZIP rate map
        ↓ if no local ZIP entry exists
State-average rate
```

### Important implementation detail

When the API responds successfully and includes a `rate` property, `TaxService.ts` returns that value immediately after multiplying it by 100. This includes a numeric zero in the current implementation.

When changing this behavior, distinguish between:

- A valid zero-tax jurisdiction
- A missing ZIP record
- An API or database failure

Those cases should not necessarily produce the same user experience.

## Data Units

The client expects the API response to use a decimal rate:

```text
0.0875 → 8.75%
0.0885 → 8.85%
```

The service converts the decimal into a percentage with:

```ts
return data.rate * 100;
```

The data import pipeline must use the same unit convention. Verify the source CSV before seeding Supabase; do not store `8.75` if the client expects `0.0875`.

## Supabase Schema

```sql
create table tax_rates (
  zip_code text primary key,
  state text,
  city text,
  combined_rate float
);
```

The API selects `combined_rate` by `zip_code` and returns it as `rate`.

## Local Data

`services/TaxService.ts` contains:

- A state-name-to-state-code map
- A state-average tax-rate map
- A small hard-coded ZIP-rate map

The local ZIP map is not a complete national data set. It is only a fallback for the ZIP codes explicitly included in the source file.

## Why a Restaurant Rate Can Differ

A state average is not the same as the rate for a restaurant address. The actual combined sales-tax rate may depend on:

- State
- County
- City
- Special tax district
- The exact restaurant ZIP Code
- Taxability of individual items
- Updates to the jurisdiction's tax data

For example, the current state map includes:

```ts
CA: 8.85
```

If the ZIP-level request fails and the location is identified as California, the application may show 8.85% even when the restaurant's actual local rate is 8.75%.

## How to Debug a Mismatch

1. Confirm the State and ZIP shown in the app header.
2. Open browser developer tools.
3. Inspect the request:

   ```text
   /api/tax-rate?zip={ZIP}
   ```

4. Check the HTTP status code and response body.
5. Compare the response value with the Supabase row.
6. Confirm that `combined_rate` uses decimal units.
7. Confirm the restaurant address and ZIP Code independently.

## Recommended Improvements

- Return an explicit source field such as `supabase`, `local_zip`, or `state_average`.
- Display the source and an accuracy notice in the UI.
- Distinguish a missing ZIP row from a valid 0% jurisdiction.
- Validate `combined_rate` during seeding.
- Add automated tests for decimal-to-percentage conversion.
- Add tests for API failure, missing ZIP, zero-tax states, and ZIP+4 input.
- Consider using an authoritative address-level tax provider when exact receipt matching is required.
