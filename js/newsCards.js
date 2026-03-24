import { getValidImage } from "../apiKey/news.js";

export function createFeaturedCard(article) {
  return `
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <img class="w-full h-80 object-cover"
           src="${getValidImage(article.image_url || article.image)}"
           alt="${article.title || "News image"}">
      <div class="p-4">
        <h2 class="text-2xl font-bold">${article.title || "No title"}</h2>
        <p class="text-gray-600 mt-2">${article.description || "No description available."}</p>
        ${
          article.url
            ? `<a href="${article.url}" target="_blank" class="inline-block mt-3 text-blue-500 hover:underline">Read More</a>`
            : ""
        }
      </div>
    </div>
  `;
}

export function createSideCard(article) {
  return `
    <div class="flex gap-3 bg-white shadow rounded p-3">
      <img class="w-24 h-24 object-cover rounded"
           src="${getValidImage(article.image_url || article.image)}"
           alt="${article.title || "News image"}">
      <div class="flex-1">
        <h3 class="font-semibold text-sm">${article.title || "No title"}</h3>
        ${
          article.url
            ? `<a href="${article.url}" target="_blank" class="text-blue-500 text-xs hover:underline mt-2 inline-block">Read More</a>`
            : ""
        }
      </div>
    </div>
  `;
}

export function createGridCard(article) {
  return `
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <img class="w-full h-40 object-cover"
           src="${getValidImage(article.image_url || article.image)}"
           alt="${article.title || "News image"}">
      <div class="p-3">
        <h3 class="font-semibold">${article.title || "No title"}</h3>
        <p class="text-sm text-gray-600 mt-2">${article.description || ""}</p>
        ${
          article.url
            ? `<a href="${article.url}" target="_blank" class="inline-block mt-3 text-blue-500 hover:underline">Read More</a>`
            : ""
        }
      </div>
    </div>
  `;
}