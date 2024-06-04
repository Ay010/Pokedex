// render pokemon cards
async function renderPokemonCards(path = "/") {
  let pokemonCardsContainer = document.getElementById("pokemon-cards-container");
  pokemonCardsContainer.innerHTML = "";

  for (let i = 0; i < numberOfPokemons; i++) {
    let PokemonJson = await getPokemonData(path + rendertPokemons[i]);
    let PokemonName = PokemonJson["name"];
    let basicPokemonType = PokemonJson["types"][0]["type"]["name"];
    let PokemonTypes = PokemonJson["types"];
    let PokemonID = PokemonJson["id"];
    let PokemonImage = PokemonJson["sprites"]["other"]["official-artwork"]["front_default"];
    let shinyPokemonGif = PokemonJson["sprites"]["other"]["showdown"]["front_shiny"];
    let PokemonGif = PokemonJson["sprites"]["other"]["showdown"]["front_default"];
    let PokemonHeight = PokemonJson["height"];
    let PokemonWeight = PokemonJson["weight"];
    let PokemonBaseEx = PokemonJson["base_experience"];
    let PokemonStats = PokemonJson["stats"];
    let PokemonAbilities = PokemonJson["abilities"];
    let PokemonAbilityNames = [];
    for (let j = 0; j < PokemonAbilities.length; j++) {
      let PokemonAbility = PokemonAbilities[j]["ability"]["name"];
      PokemonAbilityNames.push(PokemonAbility);
    }
    PokemonAbilityNames = PokemonAbilityNames.join(", ");

    pokemonCardsContainer.innerHTML += returnPokemonCardHTML(
      i,
      PokemonName,
      PokemonImage,
      basicPokemonType,
      PokemonID,
      PokemonGif,
      PokemonHeight,
      PokemonWeight,
      PokemonBaseEx,
      PokemonAbilityNames,
      PokemonStats
    );
    renderTypeContainer(PokemonTypes, i);
  }
}

// return Pokemon card HTML
function returnPokemonCardHTML(
  i,
  PokemonName,
  PokemonImage,
  basicPokemonType,
  PokemonID,
  PokemonGif,
  PokemonHeight,
  PokemonWeight,
  PokemonBaseEx,
  PokemonAbilities,
  PokemonStats
) {
  return /*html*/ `
    <div onclick=" openBigPokemonCard(
      '${PokemonName}',
      '${PokemonID}',
      '${PokemonImage}',
      '${basicPokemonType}',
      '${i}',
      '${PokemonHeight}',
      '${PokemonWeight}',
      '${PokemonBaseEx}',
      '${PokemonAbilities}',
      '${PokemonGif}'
    )"
    class='pokemon-card' style='background-color: ${allTypes[basicPokemonType]}; '>
      <div class='f-sb'>
        <h2 class='pokemon-card-name'>${PokemonName}</h2>
  
        <p class='number-of-pokemon'>#${PokemonID}</p>
      </div>
  
      <img class='pokemon-card-bg-img' src="img/pokeball bg.png" alt="">
      <img class='pokemon-card-img' src="${PokemonImage}" alt="Pokemon">
      
      <div class='f-sa' id='pokemon-card-type-container${i}'>
      </div>
  
    </div>
    `;
}

// render type container
function renderTypeContainer(PokemonTypes, i) {
  let typeContainer = document.getElementById("pokemon-card-type-container" + i);

  typeContainer.innerHTML = "";
  for (let j = 0; j < PokemonTypes.length; j++) {
    let PokemonType = PokemonTypes[j]["type"]["name"];
    typeContainer.innerHTML += /*html*/ `
        <p class='type' style='background-color: ${typeElementBgJson[PokemonType]}' class='type'>${PokemonType}</p>
      `;
  }
}

// startRenderMore
let lastRenderMoreTimeout;

function startRenderMore() {
  clearTimeout(lastRenderMoreTimeout);
  lastRenderMoreTimeout = setTimeout(() => {
    renderMorePokemonCards();
  }, 500);
}

// render more pokemon cards
async function renderMorePokemonCards() {
  addPopup();
  let searchBarValue = document.getElementById("search-bar").value.trim().toLowerCase();
  let filteredPokemons = allPokemons.filter((pokemon) =>
    pokemon.toLowerCase().startsWith(searchBarValue)
  );
  let newNumberOfPokemons = numberOfPokemons + 18;

  if (filteredPokemons.length <= newNumberOfPokemons) {
    numberOfPokemons = filteredPokemons.length;
    rendertPokemons = filteredPokemons;

    await renderPokemonCards();
    removePopup();
    return;
  } else {
    numberOfPokemons = newNumberOfPokemons;
    rendertPokemons = filteredPokemons;
  }
  await renderPokemonCards();
  removePopup();
}

// start search pokemon
let lastSearchTimeout;

function startSearch() {
  clearTimeout(lastSearchTimeout);
  lastSearchTimeout = setTimeout(() => {
    searchPokemon();
  }, 1000);
}
