// ---------- State: what the visitor has picked ----------
let places = [];
let currentPrice = "all";
let currentSort = "rating";
let searchText = "";

// ---------- Helpers ----------
function stars(rating) {
  if (typeof rating !== "number") return "Not rated yet";
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function ratingNumber(place) {
  return typeof place.rating === "number" ? place.rating : 0;
}

// ---------- Build the cards ----------
function showPlaces() {
  const container = document.getElementById("ratings-list");
  if (!container) return;

  const category = container.dataset.category;
  let list = places.filter(place => !category || place.category === category);

  // Price filter
  if (currentPrice !== "all") {
    list = list.filter(place => place.price === currentPrice);
  }

  // Search filter
  if (searchText) {
    list = list.filter(place => place.name.toLowerCase().includes(searchText));
  }

  // Sort
  list.sort((a, b) => {
    if (currentSort === "rating") return ratingNumber(b) - ratingNumber(a);
    if (currentSort === "price") return a.price.length - b.price.length;
    return a.name.localeCompare(b.name);
  });

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p class='no-results'>No coffee shops match that.</p>";
    return;
  }

  list.forEach(place => {
    const card = document.createElement("div");
    card.className = "rating-card";

    const photo = place.photo ? `<img src="${place.photo}" alt="${place.name}">` : "";

    card.innerHTML = `
      ${photo}
      <h3>${place.name}</h3>
      <p class="rating-price">${place.price}</p>
      <p class="rating-stars">${stars(place.rating)}</p>
      <p class="card-more">View details →</p>
    `;

    card.addEventListener("click", () => openModal(place));
    container.appendChild(card);
  });
}

// ---------- Modal ----------
function openModal(place) {
  const photo = place.photo ? `<img src="${place.photo}" alt="${place.name}">` : "";
  const address = place.address ? `<p class="modal-address">${place.address}</p>` : "";
  const note = place.note ? `<p>${place.note}</p>` : "";

  document.getElementById("modal-content").innerHTML = `
    ${photo}
    <h3>${place.name}</h3>
    ${address}
    <p class="rating-price">${place.price}</p>
    <p class="rating-stars">${stars(place.rating)}</p>
    ${note}
  `;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

// ---------- Connect the controls ----------
function setupControls() {
  // Price buttons (single-select)
  document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      currentPrice = button.dataset.price;
      showPlaces();
    });
  });

  // Sort dropdown
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      currentSort = sortSelect.value;
      showPlaces();
    });
  }

  // Search box (updates as you type)
  const search = document.getElementById("search");
  if (search) {
    search.addEventListener("input", () => {
      searchText = search.value.toLowerCase().trim();
      showPlaces();
    });
  }

  // Close the modal: X button, clicking the dark background, or Escape key
  const modal = document.getElementById("modal");
  if (modal) {
    document.getElementById("modal-close").addEventListener("click", closeModal);
    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeModal();
    });
  }
}

// ---------- Load the data, then start ----------
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    places = data;
    setupControls();
    showPlaces();
  })
  .catch(error => console.error("Couldn't load data.json:", error));
