// Selecting classes
const pokemonContainer = document.querySelector('.js-container-pokemon')
const spinner = document.querySelector('.js-spinner')
const menuFilter = document.querySelector('.js-filter-menu')
const dropdown = document.querySelector('.js-dropdown')


let offset = 1
let limit = 99

let isFilterBySort = ''
let currentType = ''


const handleSort = {
  asc: (pokemos) => pokemos.sort((a, b) => a.id - b.id),
  desc: (pokemos) => pokemos.sort((a, b) => b.id - a.id),
  ascName: (pokemos) => pokemos.sort(function(a, b) {
    if(a.species.name < b.species.name){
      return -1
    }
  }),
  descName: (pokemos) => pokemos.sort(function(a, b) {
    if(a.species.name > b.species.name){
      return -1
    }
  }),
}


// Events

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
      fetchByType(value)
      currentType = value
      return 
    }

    if (button.dataset.dropdown === 'sort') {
      if(currentType) {
        fetchByType(currentType)
      }

      // ordenarlos con los pokemos por defecto
      isFilterBySort = value // asc
      return 
    }

    currentType = ''
    isFilterBySort = ''
  }

})


// Functions
function fetchPokeAPI(id) {
  return new Promise((resolve, reject) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

function fetchTypes() {
  fetch(`https://pokeapi.co/api/v2/type`)
    .then(response => response.json())
    .then(typesPokemon)
    .catch(error => console.log('ERROR:', error))
}

function fetchByType(type) {
  if (!type) return
  spinner.classList.add('block')

  fetch(`https://pokeapi.co/api/v2/type/${type}`)
    .then(response => response.json())
    .then(async data => {
      resetPokemons()
      let promises = []
      data.pokemon.forEach(p => {
        const { url } = p.pokemon
        const revertedURL = url.split('/').reverse()
        const id = revertedURL[1]
        promises.push(fetchPokeAPI(id))
      })

      await renderPokemos(promises)
      spinner.classList.add('hide')
    })
    .catch(error => console.log('ERROR:', error))
}


async function fetchPokemons(offset, limit) {
  spinner.style.display = 'block'
  let promises = []

  for(let i = offset; i <= offset + limit; i++) {
    promises.push(fetchPokeAPI(i))
  }
  await renderPokemos(promises)

  spinner.style.display = 'none'
}

async function renderPokemos (allPromise) {
  const pokemos = await Promise.allSettled(allPromise)
  let parsedPokemos = []

  
  pokemos.forEach((data) => {
    if (data.status === 'fulfilled') {
      parsedPokemos.push(data.value)
    }
  })

  if (isFilterBySort) {
    parsedPokemos = handleSort[isFilterBySort]?.(parsedPokemos)
  }

  parsedPokemos.forEach(cardPokemon)
}

function resetPokemons() {
  pokemonContainer.innerHTML = ''
}


function cardPokemon(poke) {
  pokemonContainer.innerHTML += `
    <div class="container__info">
      <a href="pokemon.html?pokemon=${poke.id}" class="link__pokemon">
        <div class="container__img">
          <img class="img__pokemon" src="${poke.sprites.front_default}">
        </div>
        <p class="pokemon__name"><b>${poke.species.name}</b></p>
        <p class="pokemon__id">#${poke.id.toString().padStart(3, 0)}</p>
        <div class="line"></div>
        <div class="pokemon__type-1 center">${poke.types[0].type.name}</div>
        <div class="pokemon__type-2 center">${poke.types[1] ? poke.types[1].type.name : ''} </div>
      </a>
    </div>
  `
}



function typesPokemon(types) {
  const html = types.results.reduce((acc, cur) => {
    acc = acc + `
      <li data-dropdown-item="${cur.name}" class="dropdown__item">
        ${cur.name}
      </li>
    `

    return acc
  }, '')

  menuFilter.innerHTML = html
  
}


fetchTypes()
fetchPokemons(offset, limit)

