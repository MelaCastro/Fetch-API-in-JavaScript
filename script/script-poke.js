const pokemonContainer = document.querySelector('.js-container-pokemon')
const itemTab  = document.querySelectorAll('.js-item-tab')
const contentTab = document.querySelectorAll('.js-content-tab')
const statsContent = document.querySelector('.js-stat-content')
const abilityContent = document.querySelector('.js-ability-content')

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
  .then( data => {
    cardPokemon(data)
  })
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

function statsPokemons(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
  .then(response => response.json())
  .then(progressStat)
  .catch(error => console.log('ERROR:', error))
}

function progressStat({ stats }) {
  const html = stats.reduce((acc, cur) => {
    acc = acc + `
      <div class="stat__subcontain"> 
        <span class="stat__item-name">${cur.stat.name}</span>
        <progress max="100" value="${cur.base_stat}" class="progress"></progress>
        <span class="stat__item-num"> ${cur.base_stat}</span>
      </div>
    `
    return acc
  }, '')

  statsContent.innerHTML = html
}

function abilitiesPokemons(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
  .then(response => response.json())
  .then( data => {
    pokeAbility(data)
  })
  .catch(error => console.log('ERROR:', error))
}

async function getAbilityDescription(urls) {
  const abilityPromises = urls.map((url) => {
    return new Promise((resolve, reject) => {
      fetch(url)
      .then(response => response.json())
      .then( data => resolve(data))
      .catch(error => reject(error))
    })
  })

  return await Promise.allSettled(abilityPromises)
}

async function pokeAbility({ abilities }) {
  const abilityURLs = abilities.reduce((acc, cur) => {
    const url = cur?.ability?.url
    if (url) {
      acc.push(url)
    }

    return acc
  }, [])

  const abilitiesData = await getAbilityDescription(abilityURLs)

  const htmlAbility = abilitiesData.reduce((acc, cur) => {
    if (cur.status !== 'fulfilled') return acc

    const data = cur.value
    console.log(data)
    acc = acc + `
      <div class="ability__subcontain">      
        <span class="ability__name">${data.names[7].name}</span>
        <span class="ability__description">${data.effect_entries[1].short_effect}</span>
      </div>
    `
    return acc
  }, '')

  abilityContent.innerHTML = htmlAbility
}

fetchPokeAPI(pokemon)
statsPokemons(pokemon)
abilitiesPokemons(pokemon)
