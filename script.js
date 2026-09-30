// 1. This will hold your data once data.json loads
let places = [];

// 2. Turn a number rating into stars
function stars(rating) {
  if (typeof rating !== "number") return "Not rated yet"; // handles null
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

// 3. Build a card for each place and put it on the page
function showPlaces() {
  const container = document.getElementById("ratings-list");
  if (!container) return; // this page doesn't have a ratings section

  // Only show one category if the HTML asks for it (e.g. data-category="Coffee")
  const category = container.dataset.category;
  const list = category
    ? places.filter(place => place.category === category)
    : places;

  list.forEach(place => {
    const card = document.createElement("div");
    card.className = "rating-card";

    const photo = place.photo
      ? `<img src="${place.photo}" alt="${place.name}">`
      : "";

    const note = place.note
      ? `<p class="rating-note">${place.note}</p>`
      : "";

    card.innerHTML = `
      ${photo}
      <h3>${place.name}</h3>
      <p class="rating-category">${place.category}</p>
      <p class="rating-price">${place.price}</p>
      <p class="rating-stars">${stars(place.rating)}</p>
      ${note}
    `;

    container.appendChild(card);
  });
}

// 4. Load data.json, THEN show the cards
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    places = data;
    showPlaces();
  })
  .catch(error => {
    console.error("Couldn't load data.json:", error);
  });