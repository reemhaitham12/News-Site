import { API } from "./config.js";

export async function getStandings(leagueId = "152") {
  try {
    const res = await fetch(
      `${API.matches.url}/?met=Standings&APIkey=${API.matches.key}&leagueId=${leagueId}`,
    );

    const data = await res.json();

    if (
      !data.result ||
      !data.result.total ||
      !Array.isArray(data.result.total)
    ) {
      return [];
    }

    return data.result.total
      .map((team) => ({
        rank: team.standing_place,
        logo: team.team_logo,
        name: team.standing_team,
        played: team.standing_P,
        wins: team.standing_W,
        draws: team.standing_D,
        losses: team.standing_L,
        goalsFor: team.standing_F,
        goalsAgainst: team.standing_A,
        goalDiff: team.standing_GD,
        points: team.standing_PTS,
      }))
      .sort((a, b) => a.rank - b.rank);
  } catch (err) {
    console.error("Error fetching standings:", err);
    return [];
  }
}
