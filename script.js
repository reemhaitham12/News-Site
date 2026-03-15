import { getWeather } from "./apiKey/weather.js";
import { fetchRates, convertCurrency, ratesData } from "./apiKey/dollar.js";
import { fetchLiveMatches, getCurrentlyLiveMatches } from "./apiKey/live.js";
import { GetNews, shuffleArray } from "./apiKey/news.js";
import { createFeaturedCard, createSideCard, createGridCard } from "./apiKey/newsCards.js";

const usdRateEl = document.getElementById("usdRate");
const sarRateEl = document.getElementById("sarRate");
const egpRateEl = document.getElementById("egpRate");
const amountInput = document.getElementById("amountInput");
const currencySelect = document.getElementById("currencySelect");
const convertedAmountEl = document.getElementById("convertedAmount");

// Mobile Menu Toggle
const menuBtn = document.getElementById("menuBtn");
const newsBtn = document.getElementById("newsBtn");
const mobileMenu = document.getElementById("mobileMenu");
const newsMenu = document.getElementById("newsMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    if (newsMenu) newsMenu.classList.toggle("hidden");
  });
}

if (newsBtn && newsMenu) {
  newsBtn.addEventListener("click", () => {
    newsMenu.classList.toggle("hidden");
  });
}

// Weather
getWeather("Cairo");

// Rate Dollar
function updateConversion() {
  const amount = amountInput?.value || 1;
  const baseCurrency = currencySelect?.value || "USD";

  if (convertedAmountEl) {
    convertedAmountEl.textContent = convertCurrency(amount, baseCurrency);
  }

  if (usdRateEl) usdRateEl.textContent = convertCurrency(amount, "USD");
  if (sarRateEl) sarRateEl.textContent = convertCurrency(amount, "SAR");
}

function updateExchangeRates() {
  if (usdRateEl) usdRateEl.textContent = ratesData.USD.toFixed(2);
  if (sarRateEl) sarRateEl.textContent = ratesData.SAR.toFixed(2);
  if (egpRateEl) egpRateEl.textContent = ratesData.EGP.toFixed(2);
}

async function initCurrency() {
  await fetchRates();
  updateConversion();
  updateExchangeRates();
}

if (amountInput) amountInput.addEventListener("input", updateConversion);
if (currencySelect) currencySelect.addEventListener("change", updateConversion);

initCurrency();

// live
const liveContainer = document.getElementById("liveMatchesContainer");

async function displayLiveMatches() {
  if (!liveContainer) return;

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
        "w-[560px] h-[180px] bg-white rounded-xl shadow-lg flex flex-col justify-between p-4";

      card.innerHTML = `
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

// news
async function getMoreArticles(category) {
  try {
    const page1 = await GetNews(category, 1);
    const page2 = await GetNews(category, 2);
    const page3 = await GetNews(category, 3);
    const page4 = await GetNews(category, 4);
    const page5 = await GetNews(category, 5);

    return [...page1, ...page2, ...page3, ...page4, ...page5];
  } catch (error) {
    console.error(`Error getting more articles for ${category}:`, error);
    return [];
  }
}

async function displayCategoryPreview(category, featuredId, sideId, gridId) {
  try {
    const featuredContainer = document.getElementById(featuredId);
    const sideContainer = document.getElementById(sideId);
    const gridContainer = document.getElementById(gridId);

    if (!featuredContainer || !sideContainer || !gridContainer) {
      console.warn(`Missing containers for ${category}`);
      return;
    }

    const articles = await getMoreArticles(category);

    if (!articles || articles.length === 0) {
      console.warn(`No articles found for ${category}`);
      featuredContainer.innerHTML = `
        <div class="bg-white shadow rounded p-6 text-center text-gray-500">
          No news available for ${category}
        </div>
      `;
      sideContainer.innerHTML = "";
      gridContainer.innerHTML = "";
      return;
    }

    const uniqueArticles = articles.filter(
      (article, index, self) =>
        index === self.findIndex((a) => a.uuid === article.uuid || a.url === article.url)
    );

    const randomArticles = shuffleArray(uniqueArticles);

    const featured = randomArticles[0];
    const side = randomArticles.slice(1, 4);
    const grid = randomArticles.slice(4, 10);

    featuredContainer.innerHTML = "";
    sideContainer.innerHTML = "";
    gridContainer.innerHTML = "";

    if (featured) {
      featuredContainer.innerHTML = createFeaturedCard(featured);
    }

    side.forEach((article) => {
      sideContainer.insertAdjacentHTML("beforeend", createSideCard(article));
    });

    grid.forEach((article) => {
      gridContainer.insertAdjacentHTML("beforeend", createGridCard(article));
    });
  } catch (error) {
    console.error(`Error displaying ${category} news:`, error);
  }
}

displayCategoryPreview("world", "worldFeatured", "worldSide", "worldGrid");
displayCategoryPreview("business", "businessFeatured", "businessSide", "businessGrid");
displayCategoryPreview("technology", "technologyFeatured", "technologySide", "technologyGrid");
displayCategoryPreview("entertainment", "entertainmentFeatured", "entertainmentSide", "entertainmentGrid");
displayCategoryPreview("sport", "featuredNews", "sideNews", "gridNews");
displayCategoryPreview("science", "scienceFeatured", "scienceSide", "scienceGrid");
displayCategoryPreview("health", "healthFeatured", "healthSide", "healthGrid");
displayCategoryPreview("food", "foodFeatured", "foodSide", "foodGrid");
displayCategoryPreview("travel", "travelFeatured", "travelSide", "travelGrid");