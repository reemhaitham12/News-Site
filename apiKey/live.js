import { API } from "./config.js";

export async function fetchLiveMatches() {
    const res = await fetch(`${API.live.url}/?met=Livescore&APIkey=${API.live.key}`);
    const data = await res.json();
    return data.result;
}

// export function getCurrentlyLiveMatches(matches) {
//     const now = new Date();

//     return matches.filter(match => {

//         if (match.event_live !== "1") {
//             return false;
//         }

//         const matchStart = new Date(`${match.event_date}T${match.event_time}:00`);
//         const matchEnd = new Date(matchStart.getTime() + 90 * 60 * 1000);

//         return now >= matchStart && now <= matchEnd;
//     });
// }
// export function getCurrentlyLiveMatches(matches) {
//     return matches.filter(match => match.event_live === "1");
// }
export function getCurrentlyLiveMatches(matches) {

    const now = new Date();
    const today = now.toISOString().split("T")[0]; 

    return matches.filter(match => {

        if (match.event_live !== "1") return false;

        if (match.event_date !== today) return false;

        const matchStart = new Date(`${match.event_date}T${match.event_time}:00`);

        return matchStart <= now;

    });
}