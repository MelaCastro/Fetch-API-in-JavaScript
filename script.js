const pokemonContainer = document.querySelector('.js-container-pokemon')
const spinner = document.querySelector('.js-spinner')
const previus = document.querySelector('.js-previus')
const next = document.querySelector('.js-next')
let offset = 1
let limit = 15

function fetchPokeAPI(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
  .then(response => response.json())
  .then(data => {
    cardPokemon(data)
    spinner.style.display = 'none'
  })
}

function fetchPokemons(offset, limit) {
  spinner.style.display = 'block'
  for(let i = offset; i <= offset + limit; i++) {
    fetchPokeAPI(i)
  }
}

function cardPokemon(poke) {

  const containInfo = document.createElement('div')
  containInfo.classList.add('container__info')

  containInfo.innerHTML = `
    <div class="container__img">
      <img class="img__pokemon" src="${poke.sprites.front_default}">
    </div>
    <p class="pokemon__name">${poke.name}</p>
    <p class="pokemon__id">#${poke.id.toString().padStart(3, 0)}</p>
    <div class="pokemon__type-1 center">${poke.types[0].type.name}</div>
    <div class="pokemon__type-2 center">${poke.types[1] ? poke.types[1].type.name : null} </div>
  `
  pokemonContainer.appendChild(containInfo)
}

fetchPokemons(offset, limit)