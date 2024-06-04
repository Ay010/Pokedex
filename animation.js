let pokemonImages = [
  "img/pikachu.png",
  "img/charmander.png",
  "img/abra.png",
  "img/bellsprout.png",
  "img/bullbasaur.png",
  "img/caterpie.png",
  "img/dratini.png",
  "img/venonat.png",
  "img/eevee.png",
  "img/jigglypuff.png",
  "img/mankey.png",
  "img/miauen.png",
  "img/zubat.png",
  "img/psyduck.png",
  "img/rattata.png",
  "img/snorlax.png",
  "img/mauzi.png",
  "img/pidgey.png",
  "img/squirtle.png",
  "img/weedle.png",
];

let currentIndex = 0;

// img animation
function nextIcon() {
  let pokemonImg = document.getElementById("pokemon-img");
  let nextPokemonImg = document.getElementById("next-pokemon-img");

  if (currentIndex === pokemonImages.length - 1) {
    pokemonImg.classList.add("go-up-from-middle");
    nextPokemonImg.classList.add("go-back-from-bottom");
    pokemonImg.src = pokemonImages[pokemonImages.length - 1];
    nextPokemonImg.src = pokemonImages[0];
    currentIndex = 0;

    setTimeout(() => {
      pokemonImg.src = pokemonImages[0];
      pokemonImg.classList.remove("go-up-from-middle");
      nextPokemonImg.classList.remove("go-back-from-bottom");
      nextPokemonImg.src = pokemonImages[1];
    }, 2000);
  } else {
    pokemonImg.classList.add("go-up-from-middle");
    nextPokemonImg.classList.add("go-back-from-bottom");
    setTimeout(() => {
      currentIndex++;
      pokemonImg.src = pokemonImages[currentIndex];
      pokemonImg.classList.remove("go-up-from-middle");
      nextPokemonImg.classList.remove("go-back-from-bottom");
      nextPokemonImg.src = pokemonImages[currentIndex + 1];
    }, 2000);
  }
}

function startAnimation() {
  setInterval(nextIcon, 4000);
}
