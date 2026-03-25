import { getStandings } from "../apiKey/standings.js";
const menuBtn = document.getElementById("menuBtn");
      const mobileMenu = document.getElementById("mobileMenu");

      if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
          mobileMenu.classList.toggle("hidden");
        });
      }
const standingsTableBody = document.getElementById("standingsTableBody");
const leagueSelect = document.getElementById("leagueSelect");
const leagueTitle = document.getElementById("leagueTitle");

function renderStandingsTable(teams) {
  standingsTableBody.innerHTML = "";

  if (!teams.length) {
    standingsTableBody.innerHTML = `
      <tr>
        <td colspan="11" class="px-4 py-6 text-center text-gray-500">
          No standings found.
        </td>
      </tr>
    `;
    return;
  }

  teams.forEach((team) => {
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50 transition";

    if (team.rank <= 4) {
      row.classList.add("bg-green-50");
    } else if (team.rank >= 18) {
      row.classList.add("bg-red-50");
    }

    row.innerHTML = `
      <td class="px-4 py-4 font-semibold">${team.rank}</td>

      <td class="px-4 py-4">
        <img
          src="${team.logo}"
          alt="${team.name}"
          class="w-8 h-8 object-contain"
        />
      </td>

      <td class="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
        ${team.name}
      </td>

      <td class="px-4 py-4">${team.played}</td>
      <td class="px-4 py-4">${team.wins}</td>
      <td class="px-4 py-4">${team.draws}</td>
      <td class="px-4 py-4">${team.losses}</td>
      <td class="px-4 py-4">${team.goalsFor}</td>
      <td class="px-4 py-4">${team.goalsAgainst}</td>
      <td class="px-4 py-4">${team.goalDiff}</td>

      <td class="px-4 py-4 font-bold text-gray-900">
        ${team.points}
      </td>
    `;

    standingsTableBody.appendChild(row);
  });
}

async function loadStandings(leagueId = "152") {
  standingsTableBody.innerHTML = `
    <tr>
      <td colspan="11" class="px-4 py-6 text-center text-gray-500">
        Loading...
      </td>
    </tr>
  `;

  const standings = await getStandings(leagueId);
  renderStandingsTable(standings);
}

loadStandings();

if (leagueSelect) {
  leagueSelect.addEventListener("change", () => {
    const leagueId = leagueSelect.value;
    const leagueName = leagueSelect.options[leagueSelect.selectedIndex].text;

    if (leagueTitle) {
      leagueTitle.textContent = `${leagueName} Standings`;
    }

    loadStandings(leagueId);
  });
}