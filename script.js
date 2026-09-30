let places = [];

function stars(rating) {
  if (typeof rating !== "number") return "Not rated yet";
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function showPlaces() {
  const container = document.getElementById("ratings-list");
  if (!container) return;

  const category = container.dataset.category;
  const list = category
    ? places.filter(place => place.category === category)
    : places;

  list.forEach(place => {
    const card = document.createElement("div");
    card.className = "rating-card";

    const photo = place.photo ? `<img src="${place.photo}" alt="${place.name}">` : "";
    const note = place.note ? `<p class="rating-note">${place.note}</p>` : "";

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

fetch("data.json")
  .then(response => response.json())
  .then(data => {
    places = data;
    showPlaces();
  })
  .catch(error => console.error("Couldn't load data.json:", error));
