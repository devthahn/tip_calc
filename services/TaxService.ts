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

// Specific tax rates for known zip codes (e.g. Irvine, CA)
// In a real app, this would come from an API
const ZIP_TAX_RATES: { [key: string]: number } = {
    // Irvine, CA Zip Codes
    "92602": 7.75, "92603": 7.75, "92604": 7.75, "92606": 7.75, "92612": 7.75,
    "92614": 7.75, "92617": 7.75, "92618": 7.75, "92620": 7.75, "92697": 7.75,
    // Example: NYC
    "10001": 8.875
};

const API_KEY = '8pIciK4/tDWS55AXqTYL/w==oWOkEbhB01yBKB0H';

export const getTaxRate = async (stateInput: string | null, zipCode: string | null = null): Promise<number> => {
    // 1. Try API Ninja with Zip Code (Most Accurate)
    if (zipCode) {
        try {
            const cleanZip = zipCode.split('-')[0];
            const response = await fetch(`https://api.api-ninjas.com/v1/salestax?zip_code=${cleanZip}`, {
                headers: { 'X-Api-Key': API_KEY }
            });
            const data = await response.json();

            // API Ninja returns an array of results. We take the first one.
            // Expected format: [{ "total_rate": "0.0775", ... }]
            if (data && data.length > 0 && data[0].total_rate) {
                // Convert decimal string to percentage (e.g., "0.0775" -> 7.75)
                return parseFloat(data[0].total_rate) * 100;
            }
        } catch (error) {
            console.warn("Error fetching tax rate from API Ninja:", error);
            // Fallback to local data on error
        }
    }

    // 2. Fallback to Local Zip Code Data
    if (zipCode) {
        const cleanZip = zipCode.split('-')[0];
        if (ZIP_TAX_RATES[cleanZip]) {
            return ZIP_TAX_RATES[cleanZip];
        }
    }

    // 3. Fallback to State Average
    if (!stateInput) return 0;

    let code = stateInput.toUpperCase();

    // Check if input is a full name
    if (stateInput.length > 2) {
        // Try to find the code for the name
        const foundCode = Object.keys(STATE_NAME_TO_CODE).find(key => key.toUpperCase() === code);
        if (foundCode) {
            code = STATE_NAME_TO_CODE[foundCode];
        }
    }

    return STATE_TAX_RATES[code] || 0;
};

export const defaultTaxRate = 0;
