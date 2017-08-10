const API_ID = process.env.REACT_APP_API_ID || '0d25f428';
const APP_KEY = process.env.REACT_APP_APP_KEY || '12850276dbdf0f0c37939b716b1aba9e';

export function fetchRecipes (food = '') {
  food = food.trim()

  return fetch(`https://api.edamam.com/search?q=${food}&app_id=${API_ID}&app_key=${APP_KEY}`)
    .then((res) => res.json())
    .then(({ hits }) => hits.map(({ recipe }) => recipe))
}
