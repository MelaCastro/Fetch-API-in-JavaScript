// Selecting classes
const pokemonContainer = document.querySelector('.js-container-pokemon')
const spinner = document.querySelector('.js-spinner')
const previusPage = document.querySelector('.js-previus')
const nextPage = document.querySelector('.js-next')
const filterClose = document.querySelector('.js-filter-close')
const filterShow = document.querySelector('.js-filter-show')
const menuFilter = document.querySelector('.js-filter-menu')
const dropdown = document.querySelector('.js-dropdown')
const iconRotate = document.querySelector('.js-icon-down')

let offset = 1
let limit = 15


// // Events


dropdown.addEventListener('click', (ev) => {
  const elm = ev.target
  if (elm.dataset.dropdown) {
    elm.classList.toggle('active')
  }

  if (elm.dataset.dropdownItem) {
    const value = elm.dataset.dropdownItem
    const parent = elm.closest('.js-dropdown-container')
    const button = parent.querySelector('.js-dropdown-button')
    const span = parent.querySelector('.js-dropdown-button span')

    span.innerText = value
    button.classList.remove('active')

      if (button.dataset.dropdown === 'type') { 
        console.log(value)
        fetchTypes(value)
        return
      }


     // Hacer la logica para cuando sea SORT
  }
})

previusPage.addEventListener('click', () => {
  if(offset != 1) {
    offset -= 16
    removeChild(pokemonContainer)
    fetchPokemons(offset, limit)
  } 
})

nextPage.addEventListener('click', () => {
  offset += 16
  removeChild(pokemonContainer)
  fetchPokemons(offset, limit)
})


// Functions
function fetchPokeAPI(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
  .then(response => response.json())
  .then(data => {
    cardPokemon(data)
    spinner.style.display = 'none'
  })
  .catch(error => console.log('ERROR:', error))
}

function fetchTypes(type = '') {
  fetch(`https://pokeapi.co/api/v2/type/`)
    .then(response => response.json())
    .then(data => {
      typesPokemon(data)
    })
    .catch(error => console.log('ERROR:', error))
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
    <p class="pokemon__name"><b>${poke.name}</b></p>
    <p class="pokemon__id">#${poke.id.toString().padStart(3, 0)}</p>
    <div class="line"></div>
    <div class="pokemon__type-1 center">${poke.types[0].type.name}</div>
    <div class="pokemon__type-2 center">${poke.types[1] ? poke.types[1].type.name : ''} </div>
  `
  pokemonContainer.appendChild(containInfo)

}

function typesPokemon(types) {
  const html = types.results.reduce((acc, cur)=> {
    acc = acc + `
      <li data-dropdown-item="${cur.name}" class="dropdown__item">
        ${cur.name}
      </li>
    `

    return acc
  }, '')

  menuFilter.innerHTML = html
}



function removeChild (parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

fetchTypes()
fetchPokemons(offset, limit)