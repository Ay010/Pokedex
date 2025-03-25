// open big pokemon card
function openBigPokemonCard(
  PokemonName,
  PokemonID,
  PokemonImage,
  basicPokemonType,
  i,
  PokemonHeight,
  PokemonWeight,
  PokemonBaseEx,
  PokemonAbilities,
  PokemonGif
) {
  document.getElementById("big-pokemon-card-bg").classList.remove("bg-op-0");
  document.getElementById("big-pokemon-card").classList.remove("scale-0");
  document.body.style.overflow = "hidden";
  document.getElementById("big-pokemon-card-right-arrow").classList.remove("right-arrow-icon-scale-0");
  document.getElementById("big-pokemon-card-left-arrow").classList.remove("left-arrow-icon-scale-0");
  renderBigPokemonCard(
    PokemonName,
    PokemonID,
    PokemonImage,
    basicPokemonType,
    PokemonHeight,
    PokemonWeight,
    PokemonBaseEx,
    PokemonAbilities,
    i,
    PokemonGif
  );
  renderBigPokemonCardTypeContainer(i);
}

// close big pokemon card
function closeBigPokemonCard() {
  document.body.style.overflow = "unset";

  document.getElementById("big-pokemon-card-bg").classList.add("bg-op-0");
  document.getElementById("big-pokemon-card").classList.add("scale-0");

  document.getElementById("big-pokemon-card-right-arrow").classList.add("right-arrow-icon-scale-0");
  document.getElementById("big-pokemon-card-left-arrow").classList.add("left-arrow-icon-scale-0");
}

// next Big Pokemon Card
async function nextBigPokemonCard() {
  let i;
  indexOfPokemon = +indexOfPokemon;
  if (indexOfPokemon === rendertPokemons.length - 1) {
    i = 0;
  } else {
    i = +indexOfPokemon + 1;
  }

  addPopup();

  let PokemonJson = await getPokemonData("/" + rendertPokemons[i]);
  let PokemonName = PokemonJson["name"];
  let basicPokemonType = PokemonJson["types"][0]["type"]["name"];
  let PokemonID = PokemonJson["id"];

  let PokemonImage = PokemonJson["sprites"]["other"]["official-artwork"]["front_default"];
  let shinyPokemonGif = PokemonJson["sprites"]["other"]["showdown"]["front_shiny"];
  let PokemonGif = PokemonJson["sprites"]["other"]["showdown"]["front_default"];

  let PokemonHeight = PokemonJson["height"];
  let PokemonWeight = PokemonJson["weight"];
  let PokemonBaseEx = PokemonJson["base_experience"];

  let PokemonAbilities = PokemonJson["abilities"];
  let PokemonAbilityNames = [];
  for (let j = 0; j < PokemonAbilities.length; j++) {
    let PokemonAbility = PokemonAbilities[j]["ability"]["name"];
    PokemonAbilityNames.push(PokemonAbility);
  }
  PokemonAbilityNames = PokemonAbilityNames.join(", ");

  openBigPokemonCard(
    PokemonName,
    PokemonID,
    PokemonImage,
    basicPokemonType,
    i,
    PokemonHeight,
    PokemonWeight,
    PokemonBaseEx,
    PokemonAbilityNames,
    PokemonGif
  );
}

// previous Big Pokemon Card
async function previousBigPokemonCard() {
  let i;
  indexOfPokemon = +indexOfPokemon;
  if (indexOfPokemon === 0) {
    i = rendertPokemons.length - 1;
  } else {
    i = +indexOfPokemon - 1;
  }

  addPopup();

  let PokemonJson = await getPokemonData("/" + rendertPokemons[i]);
  let PokemonName = PokemonJson["name"];
  let basicPokemonType = PokemonJson["types"][0]["type"]["name"];
  let PokemonID = PokemonJson["id"];
  let PokemonImage = PokemonJson["sprites"]["other"]["official-artwork"]["front_default"];
  let shinyPokemonGif = PokemonJson["sprites"]["other"]["showdown"]["front_shiny"];
  let PokemonGif = PokemonJson["sprites"]["other"]["showdown"]["front_default"];
  let PokemonHeight = PokemonJson["height"];
  let PokemonWeight = PokemonJson["weight"];
  let PokemonBaseEx = PokemonJson["base_experience"];
  let PokemonAbilities = PokemonJson["abilities"];
  let PokemonAbilityNames = [];
  for (let j = 0; j < PokemonAbilities.length; j++) {
    let PokemonAbility = PokemonAbilities[j]["ability"]["name"];
    PokemonAbilityNames.push(PokemonAbility);
  }
  PokemonAbilityNames = PokemonAbilityNames.join(", ");

  openBigPokemonCard(
    PokemonName,
    PokemonID,
    PokemonImage,
    basicPokemonType,
    i,
    PokemonHeight,
    PokemonWeight,
    PokemonBaseEx,
    PokemonAbilityNames,
    PokemonGif
  );
}

let indexOfPokemon;

// render big pokemon card
async function renderBigPokemonCard(
  PokemonName,
  PokemonID,
  PokemonImage,
  basicPokemonType,
  PokemonHeight,
  PokemonWeight,
  PokemonBaseEx,
  PokemonAbilities,
  i,
  PokemonGif
) {
  indexOfPokemon = i;

  let bigPokemonCard = document.getElementById("big-pokemon-card");
  let bigPokemonCardHeader = document.getElementById("big-pokemon-card-header");
  let bigPokemonCardImage = document.getElementById("big-pokemon-card-image");
  let bigPokemonCardNav = document.getElementById("big-pokemon-card-nav");
  PokemonWeight = +PokemonWeight;
  PokemonWeight = PokemonWeight / 10;
  bigPokemonCard.style.backgroundColor = allTypes[basicPokemonType];
  bigPokemonCardHeader.innerHTML = returnBigPokemonCardHeaderHTML(PokemonName, PokemonID);

  try {
    await new Promise((resolve, reject) => {
      bigPokemonCardImage.onload = resolve;
      bigPokemonCardImage.onerror = resolve;
      bigPokemonCardImage.src = PokemonImage;
    });
  } catch (error) {}
  bigPokemonCardImage.alt = "No Image from " + PokemonName;

  bigPokemonCardNav.innerHTML = returnBigPokemonCardNavHTML(
    PokemonName,
    PokemonHeight,
    PokemonWeight,
    PokemonBaseEx,
    PokemonAbilities,
    basicPokemonType,
    PokemonImage,
    PokemonGif,
    i
  );

  renderBigPokemonCardMain(PokemonHeight, PokemonWeight, PokemonBaseEx, PokemonAbilities);
  removePopup();
}

// returnBigPokemonCardHeaderHTML
function returnBigPokemonCardHeaderHTML(PokemonName, PokemonID) {
  return /*html*/ `
      <h2 class='big-pokemon-card-name'>${PokemonName}</h2>
      <div class='big-pokemon-card-close-icon-container'>
  
        <p class='big-pokemon-card-number'>#${PokemonID}</p>
        <img class='close-icon' src="img/close.png" onclick='closeBigPokemonCard()' alt="">
      </div>
      `;
}

// returnBigPokemonCardNavHTML
function returnBigPokemonCardNavHTML(
  PokemonName,
  PokemonHeight,
  PokemonWeight,
  PokemonBaseEx,
  PokemonAbilities,
  basicPokemonType,
  PokemonImage,
  PokemonGif,
  i
) {
  return /*html*/ `
        <li id='main-li' class="aktiv-li" onclick='renderBigPokemonCardMain(${PokemonHeight},${PokemonWeight},${PokemonBaseEx},"${PokemonAbilities}")'>main</li>
        <li id='stats-li' onclick="renderBigPokemonCardStats('${PokemonName}', '${basicPokemonType}')">stats</li>
        <li id='evo-chain-li' onclick="renderBigPokemonCardEvoChain('${PokemonName}','${basicPokemonType}','${PokemonImage}',${i},'${PokemonGif}')">evo chain</li>
        `;
}

// renderBigPokemonCardMain
function renderBigPokemonCardMain(PokemonHeight, PokemonWeight, PokemonBaseEx, PokemonAbilities) {
  let bigPokemonCardMain = document.getElementById("big-pokemon-card-main");
  bigPokemonCardMain.classList.remove("big-pokemon-card-chain-container");
  document.getElementById("main-li").classList.add("aktiv-li");
  document.getElementById("stats-li").classList.remove("aktiv-li");
  document.getElementById("evo-chain-li").classList.remove("aktiv-li");

  bigPokemonCardMain.innerHTML = returnBigPokemonCardMainHTML(PokemonHeight, PokemonWeight, PokemonBaseEx, PokemonAbilities);
}

// returnBigPokemonCardMainHTML
function returnBigPokemonCardMainHTML(PokemonHeight, PokemonWeight, PokemonBaseEx, PokemonAbilities) {
  return /*html*/ `
  
        <!-- height -->
        <div class='big-pokemon-card-table-row'>
          <div class='big-pokemon-card-table-name'>Height :</div>
          <div class='big-pokemon-card-table-value'>${PokemonHeight}0 cm</div>
        </div>
  
        <!-- weight -->
        <div class='big-pokemon-card-table-row'>
          <div class='big-pokemon-card-table-name'>Weight :</div>
          <div class='big-pokemon-card-table-value'>${PokemonWeight}kg</div>
        </div>
  
        <!-- basic experience -->
        <div class='big-pokemon-card-table-row'>
          <div class='big-pokemon-card-table-name'>Basic experience :</div>
          <div class='big-pokemon-card-table-value'>${PokemonBaseEx}</div>
        </div>
  
        <!-- abilities -->
        <div class='big-pokemon-card-table-row'>
          <div class='big-pokemon-card-table-name'>Abilities :</div>
          <div class='big-pokemon-card-table-value'>${PokemonAbilities}</div>
        </div>
      `;
}

// renderBigPokemonCardStats
async function renderBigPokemonCardStats(PokemonName, basicPokemonType) {
  let index = allPokemons.indexOf(PokemonName);
  let PokemonJson = await getPokemonData("/" + allPokemons[index]);
  let PokemonStats = PokemonJson["stats"];
  let bigPokemonCardMain = document.getElementById("big-pokemon-card-main");
  bigPokemonCardMain.classList.remove("big-pokemon-card-chain-container");
  document.getElementById("stats-li").classList.add("aktiv-li");
  document.getElementById("main-li").classList.remove("aktiv-li");
  document.getElementById("evo-chain-li").classList.remove("aktiv-li");
  bigPokemonCardMain.innerHTML = "";
  for (let j = 0; j < PokemonStats.length; j++) {
    let PokemonStatNumber = PokemonStats[j]["base_stat"];
    let PokemonStatName = PokemonStats[j]["stat"]["name"];
    bigPokemonCardMain.innerHTML += returnBigPokemonCardStatHTML(PokemonStatName, PokemonStatNumber, basicPokemonType);
    setTimeout(() => {
      const bars = document.querySelectorAll(".bar");
      bars.forEach((bar) => {
        const width = bar.getAttribute("data-width");
        bar.style.width = width;
      });
    }, 50);
  }
}

// returnBigPokemonCardStatHTML
function returnBigPokemonCardStatHTML(PokemonStatName, PokemonStatNumber, basicPokemonType) {
  return /*html*/ `
      <div class='stat-container'>
        <p class='stat-name'>${PokemonStatName} :</p>
  
        <div class='stat-number-and-bar-container'>
          <p class='stat-number'>${PokemonStatNumber}</p>
          
          <div class="bar-container">
            <div  class="bar" style="width: 0%; background-color: ${allTypes[basicPokemonType]}" data-width="${PokemonStatNumber / 2}%"></div>
          </div>
        </div>
  
      `;
}

// renderBigPokemonCardEvoChain
async function renderBigPokemonCardEvoChain(PokemonName, basicPokemonType, PokemonImage, i, PokemonGif) {
  addPopup();
  let bigPokemonCardMain = document.getElementById("big-pokemon-card-main");
  document.getElementById("evo-chain-li").classList.add("aktiv-li");
  document.getElementById("stats-li").classList.remove("aktiv-li");
  document.getElementById("main-li").classList.remove("aktiv-li");
  bigPokemonCardMain.innerHTML = "";
  bigPokemonCardMain.classList.add("big-pokemon-card-chain-container");
  for (const chain of allEvoChains) {
    // if 1
    await checkIfFirstPokemonEvoExists(chain, bigPokemonCardMain, basicPokemonType, i, PokemonName);
  }

  // last if
  checkIfNoPokemonEvoExists(bigPokemonCardMain, basicPokemonType, PokemonName, PokemonGif, PokemonImage);

  removePopup();
}

async function checkIfFirstPokemonEvoExists(chain, bigPokemonCardMain, basicPokemonType, i, PokemonName) {
  // if 1
  if (chain["first-evolution"] === PokemonName || chain["second-evolution"] === PokemonName || chain["third-evolution"] === PokemonName) {
    console.log(chain);

    let firstPokemonJson = await getPokemonData("/" + chain["first-evolution"]);
    firstPokemonImage = firstPokemonJson["sprites"]["other"]["official-artwork"]["front_default"];
    let firstShinyPokemonGif = firstPokemonJson["sprites"]["other"]["showdown"]["front_shiny"];
    let firstPokemonGif = firstPokemonJson["sprites"]["other"]["showdown"]["front_default"];
    let firstPokemonSrc = firstPokemonGif;
    if (firstPokemonGif === "null" || firstPokemonGif === null || firstPokemonGif === undefined || firstPokemonGif === "undefined") {
      firstPokemonSrc = firstPokemonImage;
    }
    bigPokemonCardMain.innerHTML += /*html*/ `
      <div class='big-pokemon-card-chain-img-container' onclick='renderEvolution("${chain["first-evolution"]}", ${i})'>
        <img class='big-pokemon-card-chain-img' src="${firstPokemonSrc}" alt="${chain["first-evolution"]}" title="${chain["first-evolution"]}">
        <p class='big-pokemon-card-chain-name' style='color: ${allTypes[basicPokemonType]}'>${chain["first-evolution"]}</p>
      </div>
          `;
    // if 2
    checkIfSecondPokemonEvoExists(chain, bigPokemonCardMain, basicPokemonType, i);
  }
}

async function checkIfSecondPokemonEvoExists(chain, bigPokemonCardMain, basicPokemonType, i) {
  // if 2
  if (chain["second-evolution"]) {
    if (secondPokemonJson["sprites"]["other"]["official-artwork"]["front_default"]) {
      let secondPokemonJson = await getPokemonData("/" + chain["second-evolution"]);
      secondPokemonImage = secondPokemonJson["sprites"]["other"]["official-artwork"]["front_default"];
      let secondShinyPokemonGif = secondPokemonJson["sprites"]["other"]["showdown"]["front_shiny"];
      let secondPokemonGif = secondPokemonJson["sprites"]["other"]["showdown"]["front_default"];
      let secondPokemonSrc = secondPokemonGif;
      if (secondPokemonGif === "null" || secondPokemonGif === null || secondPokemonGif === undefined || secondPokemonGif === "undefined") {
        secondPokemonSrc = secondPokemonImage;
      }
      bigPokemonCardMain.innerHTML += /*html*/ `
                <svg style='fill: ${allTypes[basicPokemonType]}' class="big-pokemon-card-chain-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100">
                  <path  d="M5.59 7.41L7 6 13 12 7 18 5.59 16.59 10.17 12 5.59 7.41zM11.59 7.41L13 6 19 12 13 18 11.59 16.59 16.17 12 11.59 7.41z"/>
                </svg>
                
                <div class='big-pokemon-card-chain-img-container' onclick='renderEvolution("${chain["second-evolution"]}",${i})'>
                  <img class='big-pokemon-card-chain-img' src="${secondPokemonSrc}" alt="${chain["second-evolution"]}" title="${chain["second-evolution"]}">
                  <p class='big-pokemon-card-chain-name' style='color: ${allTypes[basicPokemonType]}'>${chain["second-evolution"]}</p>
                </div>
                `;

      // if 3
      checkIfThirdPokemonEvoExists(chain, bigPokemonCardMain, basicPokemonType, i);
    }
  }
}

async function checkIfThirdPokemonEvoExists(chain, bigPokemonCardMain, basicPokemonType, i) {
  // if 3
  if (chain["third-evolution"]) {
    let thirdPokemonJson = await getPokemonData("/" + chain["third-evolution"]);
    thirdPokemonImage = thirdPokemonJson["sprites"]["other"]["official-artwork"]["front_default"];
    let thirdShinyPokemonGif = thirdPokemonJson["sprites"]["other"]["showdown"]["front_shiny"];
    let thirdPokemonGif = thirdPokemonJson["sprites"]["other"]["showdown"]["front_default"];
    let thirdPokemonSrc = thirdPokemonGif;
    if (thirdPokemonGif === "null" || thirdPokemonGif === null || thirdPokemonGif === undefined || thirdPokemonGif === "undefined") {
      thirdPokemonSrc = thirdPokemonImage;
    }
    bigPokemonCardMain.innerHTML += /*html*/ `
                <svg style='fill: ${allTypes[basicPokemonType]}' class="big-pokemon-card-chain-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100">
                  <path  d="M5.59 7.41L7 6 13 12 7 18 5.59 16.59 10.17 12 5.59 7.41zM11.59 7.41L13 6 19 12 13 18 11.59 16.59 16.17 12 11.59 7.41z"/>
                </svg>
    
              <div class='big-pokemon-card-chain-img-container' onclick='renderEvolution("${chain["third-evolution"]}",${i})'>
                <img class='big-pokemon-card-chain-img' src="${thirdPokemonSrc}" alt="${chain["third-evolution"]}" title="${chain["third-evolution"]}">
                <p class='big-pokemon-card-chain-name' style='color: ${allTypes[basicPokemonType]}'>${chain["third-evolution"]}</p>
              </div>
                `;
  }
}

async function checkIfNoPokemonEvoExists(bigPokemonCardMain, basicPokemonType, PokemonName, PokemonGif, PokemonImage) {
  // last if
  if (bigPokemonCardMain.innerHTML === "") {
    let PokemonSrc = PokemonGif;
    if (PokemonGif === "null" || PokemonGif === null || PokemonGif === undefined || PokemonGif === "undefined") {
      PokemonSrc = PokemonImage;
    }
    bigPokemonCardMain.innerHTML = /*html*/ `
      <div class='big-pokemon-card-chain-img-container'>
        <img class='big-pokemon-card-chain-img' src="${PokemonSrc}" alt="${PokemonName}" title="${PokemonName}">
        <p class='big-pokemon-card-chain-name' style='color: ${allTypes[basicPokemonType]}'>${PokemonName}</p>
      </div>
          `;
  }
}

// renderSecondEvolution
async function renderEvolution(PokemonName, i) {
  addPopup();
  let PokemonJson = await getPokemonData("/" + PokemonName);
  let basicPokemonType = PokemonJson["types"][0]["type"]["name"];
  let PokemonID = PokemonJson["id"];
  let PokemonImage = PokemonJson["sprites"]["other"]["official-artwork"]["front_default"];
  let shinyPokemonGif = PokemonJson["sprites"]["other"]["showdown"]["front_shiny"];
  let PokemonGif = PokemonJson["sprites"]["other"]["showdown"]["front_default"];
  let PokemonHeight = PokemonJson["height"];
  let PokemonWeight = PokemonJson["weight"];
  let PokemonBaseEx = PokemonJson["base_experience"];
  let PokemonAbilities = PokemonJson["abilities"];
  let PokemonAbilityNames = [];
  for (let j = 0; j < PokemonAbilities.length; j++) {
    let PokemonAbility = PokemonAbilities[j]["ability"]["name"];
    PokemonAbilityNames.push(PokemonAbility);
  }
  PokemonAbilityNames = PokemonAbilityNames.join(", ");
  openBigPokemonCard(
    PokemonName,
    PokemonID,
    PokemonImage,
    basicPokemonType,
    i,
    PokemonHeight,
    PokemonWeight,
    PokemonBaseEx,
    PokemonAbilityNames,
    PokemonGif
  );
}

// render big pokemon card type container
async function renderBigPokemonCardTypeContainer(i) {
  let PokemonJson = await getPokemonData("/" + rendertPokemons[i]);
  let PokemonTypes = PokemonJson["types"];
  let bigPokemonCardTypesContainer = document.getElementById("big-pokemon-card-types-container");
  bigPokemonCardTypesContainer.innerHTML = "";
  for (let j = 0; j < PokemonTypes.length; j++) {
    let PokemonType = PokemonTypes[j]["type"]["name"];
    bigPokemonCardTypesContainer.innerHTML += /*html*/ `
        <p class='type big-type' style='background-color: ${typeElementBgJson[PokemonType]}'>${PokemonType}</p>
      `;
  }
}
