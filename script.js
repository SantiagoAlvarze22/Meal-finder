const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');

//search meal from API
function searchMeal(e) {
  e.preventDefault();

  //clear single meal
  single_mealEl.innerHTML = ''

  //Get search term
  const term = search.value;

  //check for empty
  if (term.trim()) {
    async function showInfo() {
      res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      data = await res.json()
      resultHeading.innerHTML = `<h2>Search result for '${term}':</h2>`

      //Verify if the answer has anything on it
      if (data.meals === null) {
        resultHeading.innerHTML = `<p>There are no search result. Try again</p>`
      } else {
        mealsEl.innerHTML = data.meals.map(meal => `
          <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="meal-info" data-mealID="${meal.idMeal}">
              <h3>${meal.strMeal}</h3>
            </div>
          </div>
        `).join('');
      }
    }
    showInfo()
    //clear search text
    search.value = '';
  } else {
    alert('pls enter a search term')
  }
}

//add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
    } else {
      break
    }
  }
  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}<p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}<p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
      </div>
    </div>
  `
}

//fetch meal by ID 
function getMealById(mealID) {
  async function getMeal() {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    const data = await res.json()
    const meal = data.meals[0]
    addMealToDOM(meal)
  }
  getMeal()
}

//fetch random meal from API 
function getRandomMeal() {
  //clear meals and heading 
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  async function getRandomMealAPI() {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    const data = await res.json()
    const meal = data.meals[0]
    addMealToDOM(meal)
  }
  getRandomMealAPI()
}

//event listeners
submit.addEventListener('submit', searchMeal)
random.addEventListener('click', getRandomMeal)

mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info')
    } else {
      return false
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealID');
    getMealById(mealID)
  }
})