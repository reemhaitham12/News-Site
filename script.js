import { getWeather } from "./apiKey/weather.js";
import { fetchRates, convertCurrency, ratesData } from "./apiKey/dollar.js";
import { fetchLiveMatches, getCurrentlyLiveMatches } from "./apiKey/live.js";
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





const liveContainer = document.getElementById("liveMatchesContainer");

async function displayLiveMatches() {
  try {
    const matches = await fetchLiveMatches();
    const liveMatches = await getCurrentlyLiveMatches(matches);

    liveContainer.innerHTML = "";

    if (liveMatches.length === 0) {
      liveContainer.innerHTML = "<p class='text-gray-500'>No live matches right now.</p>";
      return;
    }

    liveMatches.forEach(match => {

      const card = document.createElement("div");

      card.className =
        "w-[560px] h-[180px] bg-white rounded-xl shadow-lg flex flex-col justify-between p-4 LiveServer";

      card.innerHTML = `
                
                <!-- الوقت -->
                <div class="text-center text-xs text-red-500 font-bold">
                    LIVE • ${match.event_time}
                </div>

                <div class="flex items-center justify-between">

                    <div class="flex flex-col items-center w-1/3">
                        <img src="${match.home_team_logo}" class="w-10 h-10 mb-1"/>
                        <span class="text-xs text-center">${match.event_home_team}</span>
                    </div>

                    <div class="text-lg font-bold">
                        ${match.event_halftime_result || "0 - 0"}
                    </div>

                    <div class="flex flex-col items-center w-1/3">
                        <img src="${match.away_team_logo}" class="w-10 h-10 mb-1"/>
                        <span class="text-xs text-center">${match.event_away_team}</span>
                    </div>

                </div>

                <div class="text-center text-xs text-gray-500">
                    ${match.league_name}
                </div>
            `;

      liveContainer.appendChild(card);
    });

  } catch (err) {
    console.error("Error fetching live matches:", err);
    liveContainer.innerHTML = "<p class='text-red-500'>Failed to load live matches.</p>";
  }
}

displayLiveMatches();
setInterval(displayLiveMatches, 60000);


