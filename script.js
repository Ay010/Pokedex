const BASE_API = "https://pokeapi.co/api/v2/pokemon";
const EVO_API = "https://pokeapi.co/api/v2/evolution-chain";

let allTypes = {
  normal: "#888888",
  grass: "#78C850",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

let typeElementBgJson = {
  normal: "#D8D8C0",
  grass: "#A7DB8D",
  fire: "#FFA07A",
  water: "#77B5FE",
  electric: "#FFD700",
  ice: "#BCE6E6",
  fighting: "#D98719",
  poison: "#B19CD9",
  ground: "#E0C068",
  flying: "#ADD8E6",
  psychic: "#FFC0CB",
  bug: "#C3D21F",
  rock: "#C3C3BD",
  ghost: "#9B30FF",
  dragon: "#6A5ACD",
  dark: "#A9A9A9",
  steel: "#B0B0C4",
  fairy: "#F4D7DD",
};

let numberOfPokemons = 18;

allPokemons = [];
allEvoChains = [];

rendertPokemons = [];

saved = false;

let timeout;

// init
async function init() {
  addPopup();

  if (!saved) {
    await saveAllPokemonNames();
    await saveAllPokemonEvoChainIDs();
    saved = true;
  }

  showLoadMoreButton();

  document.getElementById("error").classList.add("d-none");
  numberOfPokemons = 18;
  rendertPokemons = allPokemons;

  await renderPokemonCards();

  document.getElementById("search-bar").value = "";
  removePopup();
}

// get pokemon data
async function getPokemonData(path = "", API = BASE_API) {
  try {
    if (path === "/undefined") {
      return;
    }
    let response = await fetch(API + path);

    let responseToJson = await response.json();
    return responseToJson;
  } catch (error) {
    console.log(error);
  }
}

// save all pokemon names
async function saveAllPokemonNames() {
  resetLoadingPopupBarFill();
  let loadingPopupBarFill = document.getElementById("loading-popup-bar-fill");
  loadingPopupBarFill.style.transition = "width 1s ease-in-out, background-color 1s ease-in-out";

  let getPokemonJson = await getPokemonData("?limit=100000&offset=0");
  let numberOfAllPokemons = getPokemonJson["results"];

  // Parallele Verarbeitung der Pokémon-Namen
  const batchSize = 300; // Anzahl der parallelen Anfragen
  for (let i = 0; i < numberOfAllPokemons.length; i += batchSize) {
    const batch = numberOfAllPokemons.slice(i, i + batchSize);
    const promises = batch.map((pokemon) => {
      allPokemons.push(pokemon.name);
      updateLoadingPopupBarFill(i + batch.indexOf(pokemon), numberOfAllPokemons.length);
    });
    await Promise.all(promises);
  }
}

// save all pokemon evo chain IDs
async function saveAllPokemonEvoChainIDs() {
  let getPokemonJson = await getPokemonData("", EVO_API + "/" + "?offset=0&limit=100000000");
  const results = getPokemonJson["results"];

  // Parallele Verarbeitung der Evolutionsketten
  const batchSize = 100; // Kleinere Batch-Größe wegen komplexerer Daten
  for (let i = 0; i < results.length; i += batchSize) {
    const batch = results.slice(i, i + batchSize);
    const promises = batch.map(async (_, index) => {
      const currentIndex = i + index;
      if (checkI(currentIndex)) return;

      const getChain = await getPokemonData("", EVO_API + "/" + (currentIndex + 1));
      const PokemonSpecies = getChain["chain"]["species"]["name"];
      let PokemonEvolvesTo;
      let PokemonEvolvesLast;

      if (getChain["chain"]["evolves_to"][0]) {
        PokemonEvolvesTo = getChain["chain"]["evolves_to"][0]["species"]["name"];
        if (getChain["chain"]["evolves_to"][0]["evolves_to"][0]) {
          PokemonEvolvesLast = getChain["chain"]["evolves_to"][0]["evolves_to"][0]["species"]["name"];
        }
      }

      allEvoChains.push({
        "first-evolution": PokemonSpecies,
        "second-evolution": allPokemons.includes(PokemonEvolvesTo) ? PokemonEvolvesTo : undefined,
        "third-evolution": allPokemons.includes(PokemonEvolvesLast) ? PokemonEvolvesLast : undefined,
      });
    });
    await Promise.all(promises);
  }
}

// check i
function checkI(i) {
  return i === 209 || i === 221 || i === 224 || i === 225 || i === 226 || i === 230 || i === 237 || i === 250 || i === null;
}

// search pokemon
async function searchPokemon() {
  addPopup();
  document.getElementById("search-bar").disabled = true;
  numberOfPokemons = 18;
  let searchBarValue = document.getElementById("search-bar").value.trim().toLowerCase();
  let filteredPokemons = allPokemons.filter((pokemon) => pokemon.toLowerCase().includes(searchBarValue));

  if (filteredPokemons.length > numberOfPokemons) {
    showLoadMoreButton();
  } else {
    hideLoadMoreButton();
  }

  rendertPokemons = filteredPokemons;
  if (searchBarValue === "") {
    rendertPokemons = allPokemons;
  } else if (filteredPokemons.length <= 0) {
    rendertPokemons = allPokemons;
    document.getElementById("error").classList.remove("d-none");
    await renderPokemonCards();
    removePopup();
    document.getElementById("search-bar").disabled = false;
    document.getElementById("search-bar").focus();
    return;
  } else if (filteredPokemons.length < 19) {
    numberOfPokemons = filteredPokemons.length;
  }
  document.getElementById("error").classList.add("d-none");
  await renderPokemonCards();
  removePopup();
  document.getElementById("search-bar").disabled = false;
  document.getElementById("search-bar").focus();
}

function stopEvent(event) {
  event.stopPropagation();
}

function addPopup() {
  document.getElementById("loading-popup").classList.add("popup-scale-1");
  document.getElementById("loading-popup-container").classList.add("show-loading-popup-container");
}

function removePopup() {
  document.getElementById("loading-popup").classList.remove("popup-scale-1");
  document.getElementById("loading-popup-container").classList.remove("show-loading-popup-container");

  resetLoadingPopupBarFill();
}

function resetLoadingPopupBarFill() {
  let loadingPopupBarFill = document.getElementById("loading-popup-bar-fill");
  loadingPopupBarFill.style.width = "0%";
  loadingPopupBarFill.style.backgroundColor = "hsl(210, 100%, 64%)";
  loadingPopupBarFill.style.transition = "width 0s ease-in-out, background-color 1s ease-in-out";
  clearTimeout(timeout);
}

function updateLoadingPopupBarFill(i, arrayLength) {
  let loadingPopupBarFill = document.getElementById("loading-popup-bar-fill");
  loadingPopupBarFill.style.width = `${(i / arrayLength) * 100}%`;

  timeout = setTimeout(() => {
    loadingPopupBarFill.style.backgroundColor = `hsl(${i * 10}, 100%, 64%)`;
  }, 2000);
}

function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}

function scrollToTop() {
  window.scrollTo(0, 0);
}

function showLoadMoreButton() {
  document.getElementById("load-more-button").classList.remove("d-none");
}

function hideLoadMoreButton() {
  document.getElementById("load-more-button").classList.add("d-none");
}
