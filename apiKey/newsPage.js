import { GetNews, paginateArticles, getValidImage, shuffleArray } from "./news.js";

const params = new URLSearchParams(window.location.search);
const category = params.get("category") || "all";

const pageTitle = document.getElementById("pageTitle");
const newsCardsContainer = document.getElementById("newsCardsContainer");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let allArticles = [];
let currentPage = 1;
const perPage = 15;

pageTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1) + " News";

async function loadNews() {
  const articles = await GetNews(category === "all" ? "general" : category);

  if (!articles || articles.length === 0) {
    newsCardsContainer.innerHTML = `
      <div class="col-span-full text-center text-gray-500 text-lg">
        No news found.
      </div>
    `;
    loadMoreBtn.classList.add("hidden");
    return;
  }

  allArticles = shuffleArray(articles);
  renderNews();
}

function renderNews() {
  const currentArticles = paginateArticles(allArticles, currentPage, perPage);

  currentArticles.forEach(article => {
    const card = `
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <img class="w-full h-48 object-cover"
             src="${getValidImage(article.image_url || article.image)}"
             alt="${article.title}">
        <div class="p-4">
          <h2 class="text-lg font-bold mb-2">${article.title}</h2>
          <p class="text-gray-600 text-sm">${article.description || "No description available."}</p>
          ${article.url ? `<a href="${article.url}" target="_blank" class="inline-block mt-3 text-blue-500 hover:underline">Read More</a>` : ""}
        </div>
      </div>
    `;

    newsCardsContainer.insertAdjacentHTML("beforeend", card);
  });

  if (currentPage * perPage >= allArticles.length) {
    loadMoreBtn.classList.add("hidden");
  }
}

loadMoreBtn.addEventListener("click", () => {
  currentPage++;
  renderNews();
});

loadNews();