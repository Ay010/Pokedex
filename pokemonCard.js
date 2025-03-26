// render pokemon cards
async function renderPokemonCards(path = "/") {
  let pokemonCardsContainer = document.getElementById("pokemon-cards-container");
  pokemonCardsContainer.innerHTML = "";

  // Parallele Verarbeitung der Pokémon-Karten
  const batchSize = 10; // Verarbeitet 10 Pokémon gleichzeitig
  for (let i = 0; i < numberOfPokemons; i += batchSize) {
    const batch = rendertPokemons.slice(i, i + batchSize);
    const promises = batch.map(async (pokemon, index) => {
      const currentIndex = i + index;
      updateLoadingPopupBarFill(currentIndex, numberOfPokemons);

      let PokemonJson = await getPokemonData(path + pokemon);

      if (PokemonJson === undefined) {
        return;
      }

      let PokemonName = PokemonJson["name"];
      let basicPokemonType = PokemonJson["types"][0]["type"]["name"];
      let PokemonTypes = PokemonJson["types"];
      let PokemonID = PokemonJson["id"];
      let PokemonImage = PokemonJson["sprites"]["other"]["official-artwork"]["front_default"];
      let PokemonGif = PokemonJson["sprites"]["other"]["showdown"]["front_default"];
      let PokemonHeight = PokemonJson["height"];
      let PokemonWeight = PokemonJson["weight"];
      let PokemonBaseEx = PokemonJson["base_experience"];
      let PokemonStats = PokemonJson["stats"];
      let PokemonAbilities = PokemonJson["abilities"];
      let PokemonAbilityNames = PokemonAbilities.map((ability) => ability.ability.name).join(", ");

      const cardHTML = returnPokemonCardHTML(
        currentIndex,
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

      return {
        id: PokemonID,
        html: cardHTML,
        types: PokemonTypes,
        index: currentIndex,
      };
    });

    const results = await Promise.all(promises);

    // Sortiere die Ergebnisse nach ID und füge sie in der richtigen Reihenfolge hinzu
    results
      .filter((result) => result !== undefined)
      .sort((a, b) => a.id - b.id)
      .forEach((result) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = result.html;
        pokemonCardsContainer.appendChild(tempDiv.firstElementChild);
        renderTypeContainer(result.types, result.index);
      });
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
  let filteredPokemons = allPokemons.filter((pokemon) => pokemon.toLowerCase().includes(searchBarValue));
  let newNumberOfPokemons = numberOfPokemons + 18;

  if (filteredPokemons.length > newNumberOfPokemons) {
    showLoadMoreButton();
  } else {
    hideLoadMoreButton();
  }

  if (filteredPokemons.length <= newNumberOfPokemons) {
    numberOfPokemons = filteredPokemons.length;
    rendertPokemons = filteredPokemons;

    await renderPokemonCards();
    setTimeout(() => {
      scrollToBottom();
    }, 100);
    removePopup();
    return;
  } else {
    numberOfPokemons = newNumberOfPokemons;
    rendertPokemons = filteredPokemons;
  }

  await renderPokemonCards();

  setTimeout(() => {
    scrollToBottom();
  }, 100);

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
