import { API } from "./config.js";

export let ratesData = { USD: 1, SAR: 3.75, EGP: 52.3937 };

export async function fetchRates() {
  try {
    const res = await fetch(`${API.dollar.url}/v6/${API.dollar.key}/latest/USD`);
    const data = await res.json();
    if (data.result === "success" && data.conversion_rates) {
      ratesData = { ...ratesData, ...data.conversion_rates };
      console.log("Live rates fetched:", {
        USD: ratesData.USD,
        SAR: ratesData.SAR,
        EGP: ratesData.EGP,
      });
    } else {
      console.warn("Failed to fetch rates, using fallback data");
    }
    return ratesData;
  } catch (err) {
    console.error("Error fetching rates:", err);
    return ratesData;
  }
}

// convert money
export function convertCurrency(amount, baseCurrency) {
  amount = parseFloat(amount) || 0;

  if (!ratesData[baseCurrency] || !ratesData.EGP) return 0;

  const result = amount * ratesData.EGP / ratesData[baseCurrency];
  return result.toFixed(2);
}
