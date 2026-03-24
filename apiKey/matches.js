import { API } from "./config.js";

function normalizeStatus(match) {
  if (match.event_live === "1") return "LIVE";
  if (match.event_status === "Finished") return "FINISHED";
  return "UPCOMING";
}

export async function getMatches(from, to, leagueId = "152") {
  try {
    const res = await fetch(
      `${API.matches.url}/?met=Fixtures&APIkey=${API.matches.key}&from=${from}&to=${to}&leagueId=${leagueId}`
    );

    const data = await res.json();

    if (!data.result || !Array.isArray(data.result)) {
      return [];
    }

    if (data.result[0]?.cod) {
      console.error("API Error:", data.result[0].msg);
      return [];
    }

    return data.result.map((match) => ({
      id: match.event_key,
      date: match.event_date,
      time: match.event_time,
      status: normalizeStatus(match),
      homeTeam: match.event_home_team,
      awayTeam: match.event_away_team,
      homeLogo: match.home_team_logo,
      awayLogo: match.away_team_logo,
      finalResult: match.event_final_result,
      leagueName: match.league_name,
    }));
  } catch (err) {
    console.error("Error fetching matches:", err);
    return [];
  }
}