const fetch = require('node-fetch');

const getExchangeRate = async (from, to) => {
    try {
        const response = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
        if (!response.ok) {
            throw new Error(`Error fetching exchange rate: ${response.statusText}`);
        }
        const data = await response.json();
        return data.rates[to];
    } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        return 0;
    }
};

(async () => {
    console.log("Testing Currency Service...");
    const rate = await getExchangeRate('USD', 'KRW');
    console.log(`USD to KRW Rate: ${rate}`);
    if (rate > 0) {
        console.log("SUCCESS: Rate fetched successfully.");
    } else {
        console.log("FAILURE: Could not fetch rate.");
    }
})();
