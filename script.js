import { getWeather } from "./apiKey/weather.js";

// Mobile Menu Toggle
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Search Bar Toggle
// const searchBtn = document.getElementById("searchBtn");
// const searchBar = document.getElementById("searchBar");
// const searchInput = searchBar.querySelector("input");

// searchBtn.addEventListener("click", () => {
//   searchBar.classList.toggle("opacity-0");
//   searchBar.classList.toggle("-translate-y-5");
//   searchBar.classList.toggle("pointer-events-none");

//   // Focus cursor in input when visible
//   if (!searchBar.classList.contains("opacity-0")) {
//     searchInput.focus();
//   }
// });

// weather
getWeather("Cairo");
