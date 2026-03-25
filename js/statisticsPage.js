import {
  getTopScorers,
  getPlayersStatistics,
} from "../apiKey/statistics.js";
const menuBtn = document.getElementById("menuBtn");
      const mobileMenu = document.getElementById("mobileMenu");

      if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
          mobileMenu.classList.toggle("hidden");
        });
      }
const statisticsTableBody = document.getElementById("statisticsTableBody");
const leagueSelect = document.getElementById("leagueSelect");
const statisticsTitle = document.getElementById("statisticsTitle");
const topScorersBtn = document.getElementById("topScorersBtn");
const playersBtn = document.getElementById("playersBtn");
const sortSelect = document.getElementById("sortSelect");

let currentView = "topscorers";
let currentLeagueId = "152";
let currentData = [];

function renderTable(players) {
  statisticsTableBody.innerHTML = "";

  if (!players.length) {
    statisticsTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="px-4 py-6 text-center text-gray-500">
          No statistics found.
        </td>
      </tr>
    `;
    return;
  }

  players.forEach((player, index) => {
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50 transition";

    row.innerHTML = `
      <td class="px-4 py-4 font-semibold">${index + 1}</td>

      <td class="px-4 py-4 text-center">
        <img
          src="${player.playerPhoto}"
          alt="${player.playerName}"
          class="w-12 h-12 rounded-full object-cover border border-gray-200 bg-gray-100 mx-auto"
          onerror="this.onerror=null;this.src='https://via.placeholder.com/48?text=Player';"
        />
      </td>

      <td class="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
        ${player.playerName}
      </td>

      <td class="px-4 py-4 text-center">
        <img
          src="${player.teamLogo}"
          alt="${player.teamName}"
          class="w-10 h-10 object-contain bg-gray-100 mx-auto"
          onerror="this.onerror=null;this.src='https://via.placeholder.com/40?text=Team';"
        />
      </td>

      <td class="px-4 py-4 whitespace-nowrap">${player.teamName}</td>

      <td class="px-4 py-4 font-semibold text-gray-900">
        ⚽ ${player.goals}
      </td>

      <td class="px-4 py-4 font-semibold text-yellow-500">
        🟨 ${player.yellowCards}
      </td>

      <td class="px-4 py-4 font-semibold text-red-500">
        🟥 ${player.redCards}
      </td>
    `;

    statisticsTableBody.appendChild(row);
  });
}

function sortPlayers(players, sortBy) {
  const sorted = [...players];

  if (sortBy === "goals") {
    sorted.sort((a, b) => b.goals - a.goals);
  } else if (sortBy === "yellowCards") {
    sorted.sort((a, b) => b.yellowCards - a.yellowCards);
  } else if (sortBy === "redCards") {
    sorted.sort((a, b) => b.redCards - a.redCards);
  }

  return sorted;
}

function updateButtons() {
  if (currentView === "topscorers") {
    topScorersBtn.classList.remove("bg-gray-100", "text-gray-800");
    topScorersBtn.classList.add("bg-blue-600", "text-white");

    playersBtn.classList.remove("bg-blue-600", "text-white");
    playersBtn.classList.add("bg-gray-100", "text-gray-800");
  } else {
    playersBtn.classList.remove("bg-gray-100", "text-gray-800");
    playersBtn.classList.add("bg-blue-600", "text-white");

    topScorersBtn.classList.remove("bg-blue-600", "text-white");
    topScorersBtn.classList.add("bg-gray-100", "text-gray-800");
  }
}

async function loadStatistics() {
  statisticsTableBody.innerHTML = `
    <tr>
      <td colspan="8" class="px-4 py-6 text-center text-gray-500">
        Loading...
      </td>
    </tr>
  `;

  if (currentView === "topscorers") {
    currentData = await getTopScorers(currentLeagueId);
  } else {
    currentData = await getPlayersStatistics(currentLeagueId);
  }

  const sortedData = sortPlayers(currentData, sortSelect.value);
  renderTable(sortedData);
}

topScorersBtn.addEventListener("click", async () => {
  currentView = "topscorers";
  updateButtons();
  await loadStatistics();
});

playersBtn.addEventListener("click", async () => {
  currentView = "players";
  updateButtons();
  await loadStatistics();
});

sortSelect.addEventListener("change", () => {
  const sortedData = sortPlayers(currentData, sortSelect.value);
  renderTable(sortedData);
});

leagueSelect.addEventListener("change", async () => {
  currentLeagueId = leagueSelect.value;
  const leagueName = leagueSelect.options[leagueSelect.selectedIndex].text;
  statisticsTitle.textContent = `${leagueName} Statistics`;
  await loadStatistics();
});

updateButtons();
loadStatistics();