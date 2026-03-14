import { getWeather } from "./apiKey/weather.js";
import { fetchRates, convertCurrency, ratesData } from "./apiKey/dollar.js";
const usdRateEl = document.getElementById("usdRate");
const sarRateEl = document.getElementById("sarRate");
const egpRateEl = document.getElementById("egpRate");
const amountInput = document.getElementById("amountInput");
const currencySelect = document.getElementById("currencySelect");
const convertedAmountEl = document.getElementById("convertedAmount");

// Mobile Menu Toggle
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Weather
getWeather("Cairo");



// Rate Dollar
function updateConversion() {
  const amount = amountInput.value;
  const baseCurrency = currencySelect.value;
  convertedAmountEl.textContent = convertCurrency(amount, baseCurrency);
  usdRateEl.textContent = convertCurrency(amount, "USD");
  sarRateEl.textContent = convertCurrency(amount, "SAR");
}

function updateExchangeRates() {
  usdRateEl.textContent = ratesData.USD.toFixed(2);
  sarRateEl.textContent = ratesData.SAR.toFixed(2);
  egpRateEl.textContent = ratesData.EGP.toFixed(2);
}

async function initCurrency() {
  await fetchRates();
  updateConversion();
  updateExchangeRates();
}

// Event listeners
amountInput.addEventListener("input", updateConversion);
currencySelect.addEventListener("change", updateConversion);
initCurrency();