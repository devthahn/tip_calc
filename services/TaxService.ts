import { Platform } from 'react-native';

export interface TaxRateResult {
    rate: number;
    isFallback: boolean;
    source: 'api' | 'state_avg' | 'default';
    message?: string;
}

const getApiBaseUrl = (): string => {
    // 1. Allow overriding API base URL via environment variable (e.g., for native iOS/Android builds)
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '');
    }
    // 2. In web browser, use window origin or relative path
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.origin) {
        return window.location.origin;
    }
    return '';
};

// Mock data for US State Tax Rates (Average combined rates)
// Source: https://taxfoundation.org/data/all/state/2024-sales-taxes/ (Approximation)
const STATE_TAX_RATES: { [key: string]: number } = {
    AL: 9.29, AK: 1.81, AZ: 8.37, AR: 9.44, CA: 8.85, CO: 7.81, CT: 6.35, DE: 0.00, DC: 6.00,
    FL: 7.00, GA: 7.38, HI: 4.50, ID: 6.07, IL: 8.86, IN: 7.00, IA: 6.94, KS: 8.65, KY: 6.00,
    LA: 9.56, ME: 5.50, MD: 6.00, MA: 6.25, MI: 6.00, MN: 7.52, MS: 7.06, MO: 8.39, MT: 0.00,
    NE: 6.97, NV: 8.23, NH: 0.00, NJ: 6.60, NM: 7.62, NY: 8.53, NC: 7.00, ND: 6.97, OH: 7.24,
    OK: 8.98, OR: 0.00, PA: 6.34, RI: 7.00, SC: 7.43, SD: 6.11, TN: 9.55, TX: 8.20, UT: 7.19,
    VT: 6.36, VA: 5.77, WA: 9.38, WV: 6.57, WI: 5.70, WY: 5.44
};

const STATE_NAME_TO_CODE: { [key: string]: string } = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
    "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "District of Columbia": "DC",
    "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL",
    "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA",
    "Maine": "ME", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN",
    "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
    "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
    "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR",
    "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD",
    "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virginia": "VA",
    "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
};

export const getTaxRate = async (stateInput: string | null, zipCode: string | null = null): Promise<TaxRateResult> => {
    // 1. Query Serverless API by ZIP Code (/api/tax-rate)
    if (zipCode) {
        const cleanZip = zipCode.split('-')[0].trim();
        try {
            const baseUrl = getApiBaseUrl();
            const endpoint = `${baseUrl}/api/tax-rate?zip=${encodeURIComponent(cleanZip)}`;
            const response = await fetch(endpoint, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const contentType = response.headers.get('content-type') || '';
                if (contentType.includes('application/json')) {
                    const data = await response.json();
                    if (data.rate !== undefined && data.rate > 0) {
                        return {
                            rate: data.rate * 100,
                            isFallback: false,
                            source: 'api',
                            message: 'API'
                        };
                    }
                } else {
                    console.warn("API returned non-JSON response (e.g. HTML rewrite error):", contentType);
                }
            } else {
                console.warn(`API lookup failed (${response.status}):`, response.statusText);
            }
        } catch (error) {
            console.warn("Error fetching tax rate from /api/tax-rate:", error);
        }
    }

    // 2. Fallback to State Average if ZIP not found in DB or API is unreachable
    if (!stateInput) {
        return {
            rate: 0,
            isFallback: true,
            source: 'default',
            message: 'Default'
        };
    }

    let code = stateInput.toUpperCase().trim();

    // Check if input is a full state name
    if (code.length > 2) {
        const foundCode = Object.keys(STATE_NAME_TO_CODE).find(key => key.toUpperCase() === code);
        if (foundCode) {
            code = STATE_NAME_TO_CODE[foundCode];
        }
    }

    const stateAvgRate = STATE_TAX_RATES[code] || 0;
    return {
        rate: stateAvgRate,
        isFallback: true,
        source: 'state_avg',
        message: 'State Avg (Offline / Estimated)'
    };
};

export const defaultTaxRate = 0;

