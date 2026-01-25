export const getExchangeRate = async (from: string, to: string): Promise<number> => {
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
