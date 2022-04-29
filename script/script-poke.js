
const querystring = window.location.search
console.log(querystring) 

const params = new URLSearchParams(querystring)
const pokemon = params.get('pokemon')
console.log(pokemon);
