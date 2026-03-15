import { API } from "./config.js";

const categoryMap = {
  business: "business",
  technology: "tech",
  tech: "tech",
  sport: "sports",
  sports: "sports",
  health: "health",
  science: "science",
  entertainment: "entertainment",
  world: "politics",
  travel:"travel",
  all: "general",
  general: "general"
};

export async function GetNews(category, page = 1) {
  try {
    const normalizedCategory = categoryMap[category?.toLowerCase()] || "general";

    const url = `${API.news.url}/top?api_token=${API.news.key}&categories=${normalizedCategory}&locale=us&language=en&page=${page}`;

    const res = await fetch(url);
    const data = await res.json();

    console.log("News API response:", data);

    if (!res.ok) {
      console.error("News API error:", data);
      return [];
    }

    return data.data || data.articles || [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getValidImage(image) {
  return image && image !== "null"
    ? image
    : "https://picsum.photos/600/400?random=1";
}

export function paginateArticles(articles, page = 1, perPage = 15) {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return articles.slice(start, end);
}