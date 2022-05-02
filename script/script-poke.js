const pokemonContainer = document.querySelector('.js-container-pokemon')
const itemTab  = document.querySelectorAll('.js-item-tab')
const contentTab = document.querySelectorAll('.js-content-tab')

const querystring = window.location.search
// console.log(querystring) 
const params = new URLSearchParams(querystring)
const pokemon = params.get('pokemon')
// console.log(pokemon);

itemTab.forEach(( elm , i ) => {
  itemTab[i].addEventListener('click', () => {
    
    itemTab.forEach(( elm , i ) => {

      itemTab[i].classList.remove('active')
      contentTab[i].classList.remove('active')

    })

    itemTab[i].classList.add('active')
    contentTab[i].classList.add('active')
  })
})


function fetchPokeAPI(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
  .then(response => response.json())
  .then(cardPokemon)
  .catch(error => console.log('ERROR:', error))
}

function cardPokemon(poke) {
  pokemonContainer.innerHTML = `
      <div class="container__info">     
        <div class="container__img">
          <img class="img__pokemon" src="${poke.sprites.front_default}">
        </div>
        <p class="pokemon__name"><b>${poke.name}</b></p>
        <p class="pokemon__id">#${poke.id.toString().padStart(3, 0)}</p>
        <div class="line"></div>
        <div class="pokemon__type-1 center">${poke.types[0].type.name}</div>
        <div class="pokemon__type-2 center">${poke.types[1] ? poke.types[1].type.name : ''} </div>
      </div>
  `
}

fetchPokeAPI(pokemon)
