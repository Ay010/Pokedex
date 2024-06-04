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

let aI;

allPokemons = [];

allEvoChains = [];

rendertPokemons = [];

saveAllPokemonNames();
saveAllPokemonEvoChainIDs();

// init
async function init() {
  addPopup();
  document.getElementById("error").classList.add("d-none");
  numberOfPokemons = 18;
  rendertPokemons = allPokemons;

  await renderPokemonCards();

  document.getElementById("search-bar").value = "";
  removePopup();
}

// get pokemon data
async function getPokemonData(path = "", API = BASE_API) {
  let response = await fetch(API + path);
  let responseToJson = await response.json();
  return responseToJson;
}

// save all pokemon names
async function saveAllPokemonNames() {
  let getPokemonJson = await getPokemonData("?limit=100000&offset=0");
  let numberOfAllPokemons = getPokemonJson["results"];

  for (let i = 0; i < numberOfAllPokemons.length; i++) {
    let pokemonName = numberOfAllPokemons[i]["name"];
    allPokemons.push(pokemonName);
  }
}

// save all pokemon evo chain IDs
async function saveAllPokemonEvoChainIDs() {
  let getPokemonJson = await getPokemonData("", EVO_API + "/" + "?offset=0&limit=100000000");
  for (let i = 0; i < getPokemonJson["results"].length; i++) {
    if (checkI(i)) {
      continue;
    }
    let getChain = await getPokemonData("", EVO_API + "/" + (i + 1));
    let PokemonSpecies = getChain["chain"]["species"]["name"];
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
      "second-evolution": PokemonEvolvesTo,
      "third-evolution": PokemonEvolvesLast,
    });
  }
}

// check i
function checkI(i) {
  return (
    i === 209 ||
    i === 221 ||
    i === 224 ||
    i === 225 ||
    i === 226 ||
    i === 230 ||
    i === 237 ||
    i === 250 ||
    i === null
  );
}

// search pokemon
async function searchPokemon() {
  addPopup();
  document.getElementById("search-bar").disabled = true;
  numberOfPokemons = 18;
  let searchBarValue = document.getElementById("search-bar").value.trim().toLowerCase();
  let filteredPokemons = allPokemons.filter((pokemon) =>
    pokemon.toLowerCase().startsWith(searchBarValue)
  );
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
  document
    .getElementById("loading-popup-container")
    .classList.remove("show-loading-popup-container");
}
