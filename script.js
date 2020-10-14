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
    async function showName() {
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
    showName()
    //clear search text
    search.value = '';
  } else {
    alert('pls enter a search term')
  }
}

//event listeners
submit.addEventListener('submit', searchMeal)

