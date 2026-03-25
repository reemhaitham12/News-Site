import { getMatches } from "../apiKey/matches.js";
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}
const fromDateInput = document.getElementById("fromDate");
const toDateInput = document.getElementById("toDate");
const leagueSelect = document.getElementById("leagueSelect");
const searchBtn = document.getElementById("searchBtn");
const matchesContainer = document.getElementById("matchesContainer");
const filterButtons = document.querySelectorAll(".filter-btn");

let allMatches = [];
let selectedStatus = "ALL";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayDate() {
  return formatDate(new Date());
}

function getStatusBadge(status) {
  if (status === "LIVE") {
    return `
      <span class="inline-block px-3 py-1 mb-2 text-xs font-medium text-red-700 bg-red-100 rounded-full">
        Live
      </span>
    `;
  }

  if (status === "FINISHED") {
    return `
      <span class="inline-block px-3 py-1 mb-2 text-xs font-medium text-green-700 bg-green-100 rounded-full">
        Finished
      </span>
    `;
  }

  return `
    <span class="inline-block px-3 py-1 mb-2 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
      Upcoming
    </span>
  `;
}

function createMatchCard(match) {
  let centerContent = "";

  if (match.status === "FINISHED") {
    centerContent = `
      ${getStatusBadge(match.status)}
      <p class="text-lg md:text-2xl font-bold text-gray-900">${match.finalResult}</p>
      <p class="text-sm text-gray-500 mt-1">${match.time}</p>
    `;
  } else if (match.status === "LIVE") {
    centerContent = `
      ${getStatusBadge(match.status)}
      <p class="text-lg md:text-2xl font-bold text-red-600">${match.finalResult || "Live Now"}</p>
      <p class="text-sm text-gray-500 mt-1">${match.time}</p>
    `;
  } else {
    centerContent = `
      ${getStatusBadge(match.status)}
      <p class="text-sm md:text-base font-semibold text-gray-800">${match.time}</p>
    `;
  }

  return `
    <div class="w-full bg-white p-4 md:p-6 border border-gray-200 rounded-xl shadow-sm">
      <div class="flex items-center justify-between gap-4">
        <div class="flex flex-col items-center text-center w-1/3">
          <img
            src="${match.homeLogo}"
            alt="${match.homeTeam}"
            class="w-12 h-12 object-contain mb-2"
          />
          <h3 class="text-sm md:text-base font-semibold text-gray-900">
            ${match.homeTeam}
          </h3>
        </div>

        <div class="flex flex-col items-center justify-center text-center w-1/3">
          ${centerContent}
        </div>

        <div class="flex flex-col items-center text-center w-1/3">
          <img
            src="${match.awayLogo}"
            alt="${match.awayTeam}"
            class="w-12 h-12 object-contain mb-2"
          />
          <h3 class="text-sm md:text-base font-semibold text-gray-900">
            ${match.awayTeam}
          </h3>
        </div>
      </div>
    </div>
  `;
}

function groupMatchesByDate(matches) {
  return matches.reduce((acc, match) => {
    if (!acc[match.date]) {
      acc[match.date] = [];
    }
    acc[match.date].push(match);
    return acc;
  }, {});
}

function renderMatches(matches) {
  matchesContainer.innerHTML = "";

  if (!matches.length) {
    matchesContainer.innerHTML = `
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center text-gray-500">
        No matches found.
      </div>
    `;
    return;
  }

  const groupedMatches = groupMatchesByDate(matches);

  Object.keys(groupedMatches)
    .sort()
    .forEach((date) => {
      const section = document.createElement("div");
      section.className = "space-y-4";

      section.innerHTML = `
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
          ${date}
        </h2>
        ${groupedMatches[date].map(createMatchCard).join("")}
      `;

      matchesContainer.appendChild(section);
    });
}

function applyFilters() {
  if (selectedStatus === "ALL") {
    renderMatches(allMatches);
    return;
  }

  const filteredMatches = allMatches.filter(
    (match) => match.status === selectedStatus,
  );

  renderMatches(filteredMatches);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedStatus = button.dataset.status;

    filterButtons.forEach((btn) => {
      btn.classList.remove("bg-blue-600", "text-white");
      btn.classList.add("bg-gray-100", "text-gray-800");
    });

    button.classList.remove("bg-gray-100", "text-gray-800");
    button.classList.add("bg-blue-600", "text-white");

    applyFilters();
  });
});

searchBtn.addEventListener("click", async () => {
  let from = fromDateInput.value;
  let to = toDateInput.value;
  const leagueId = leagueSelect.value || "152";

  const today = getTodayDate();

  if (!from) {
    from = today;
    fromDateInput.value = today;
  }

  if (!to) {
    to = today;
    toDateInput.value = today;
  }

  if (from > to) {
    alert("From date must be before To date.");
    return;
  }

  allMatches = await getMatches(from, to, leagueId);
  applyFilters();
});

async function loadDefaultMatches() {
  const today = getTodayDate();

  fromDateInput.value = today;
  toDateInput.value = today;

  if (leagueSelect) {
    leagueSelect.value = "152";
  }

  allMatches = await getMatches(today, today, "152");
  applyFilters();
}

loadDefaultMatches();
