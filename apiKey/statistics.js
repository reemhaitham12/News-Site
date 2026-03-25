import { API } from "./config.js";

async function getTeamDetails(teamId) {
  try {
    const res = await fetch(
      `${API.matches.url}/?met=Teams&APIkey=${API.matches.key}&teamId=${teamId}`
    );

    const data = await res.json();

    if (!data.result || !Array.isArray(data.result) || !data.result.length) {
      return null;
    }

    return data.result[0];
  } catch (err) {
    console.error("Error fetching team details:", err);
    return null;
  }
}

async function getLeagueTeams(leagueId) {
  try {
    const res = await fetch(
      `${API.matches.url}/?met=Teams&APIkey=${API.matches.key}&leagueId=${leagueId}`
    );

    const data = await res.json();

    if (!data.result || !Array.isArray(data.result)) {
      return [];
    }

    return data.result;
  } catch (err) {
    console.error("Error fetching league teams:", err);
    return [];
  }
}

export async function getTopScorers(leagueId = "152") {
  try {
    const res = await fetch(
      `${API.matches.url}/?met=Topscorers&APIkey=${API.matches.key}&leagueId=${leagueId}`
    );

    const data = await res.json();

    if (!data.result || !Array.isArray(data.result)) {
      return [];
    }

    const teamCache = {};

    const players = await Promise.all(
      data.result.map(async (player) => {
        const teamId = String(player.team_key);

        if (!teamCache[teamId]) {
          teamCache[teamId] = await getTeamDetails(teamId);
        }

        const teamDetails = teamCache[teamId];

        const matchedPlayer = teamDetails?.players?.find(
          (p) => String(p.player_key) === String(player.player_key)
        );

        return {
          rank: Number(player.player_place || 0),
          playerName: player.player_name || "Unknown Player",
          playerPhoto:
            matchedPlayer?.player_image ||
            "https://via.placeholder.com/48?text=Player",
          teamName: player.team_name || "Unknown Team",
          teamLogo:
            teamDetails?.team_logo ||
            "https://via.placeholder.com/40?text=Team",
          goals: Number(player.goals || matchedPlayer?.player_goals || 0),
          yellowCards: Number(matchedPlayer?.player_yellow_cards || 0),
          redCards: Number(matchedPlayer?.player_red_cards || 0),
        };
      })
    );

    return players.sort((a, b) => a.rank - b.rank);
  } catch (err) {
    console.error("Error fetching top scorers:", err);
    return [];
  }
}

export async function getPlayersStatistics(leagueId = "152") {
  try {
    const teams = await getLeagueTeams(leagueId);

    if (!teams.length) {
      return [];
    }

    const allPlayers = teams.flatMap((team) =>
      (team.players || []).map((player) => ({
        rank: 0,
        playerName: player.player_name || "Unknown Player",
        playerPhoto:
          player.player_image ||
          "https://via.placeholder.com/48?text=Player",
        teamName: team.team_name || "Unknown Team",
        teamLogo:
          team.team_logo ||
          "https://via.placeholder.com/40?text=Team",
        goals: Number(player.player_goals || 0),
        yellowCards: Number(player.player_yellow_cards || 0),
        redCards: Number(player.player_red_cards || 0),
      }))
    );

    return allPlayers
      .sort((a, b) => b.goals - a.goals)
      .map((player, index) => ({
        ...player,
        rank: index + 1,
      }));
  } catch (err) {
    console.error("Error fetching players statistics:", err);
    return [];
  }
}