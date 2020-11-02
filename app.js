'use strict'


const foodUrl = 'https://www.themealdb.com/api/json/v1/1/'

const drinkUrl = 'https://www.thecocktaildb.com/api/json/v1/1/'

/* ------------------------ GENERATE FUNCTIONS ---------------------------*/

function generateOptionElement(option) {
    return `<option value="${option}">${option}</option>`
}

function generateFoodListElement(option) {
    return `<li idMeal="${option.idMeal}"><a href="#food-pick">${option.strMeal}</a></li>`
}

function generateCuisineOptions(response) {
    const cuisines = response.meals;
    let optionsList = ``
    for(let i = 0; i < cuisines.length; i++) {
        optionsList += generateOptionElement(cuisines[i].strArea)
    }
    return optionsList
}

function generateFoodList(response) {
    console.log('generateFoodList ran.')
    
    const recipes = response.meals
    let recipeList = ''

    for(let i = 0; i < recipes.length; i++) {
        recipeList += generateFoodListElement(recipes[i])
    }

    return recipeList
}

function generateIngredients(recipe) {
    let ingredientList = ``
    const ing = 'strIngredient'
    const meas = 'strMeasure'
    let c = 1
    let curIng = ing + c
    let curMeas= meas + c
    while (recipe[curIng]) {
        ingredientList += `<li>${recipe[curMeas]} ${recipe[curIng]}</li>`
        c++
        curIng = ing + c
        curMeas = meas + c
    } 
    return ingredientList
}

function generateFoodRecipe(response) {
    const recipe = response.meals[0];
    const ingredients = generateIngredients(recipe)
    return `<h3 class="food-title">${recipe.strMeal}</h3>
            <img class="food-image" src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <ul class="food-ingredients">
                ${ingredients}
            </ul>
            <p class="food-instructions">${recipe.strInstructions}</p>
            <a href="${recipe.strYoutube}">Video</a>`
}


/* ------------------------ EVENT HANDLERS ---------------------------*/

/* ------ Food ------ */

function handleCuisineSelect() {
    //Creates event listener for cuisine submit.
    console.log('handleCuisineSelect ran.')
    $('#js-food-form').submit(event => {
        event.preventDefault();
        const cuisineChoice = $('#js-cuisines').val()
        renderRecipeList(cuisineChoice, $('.food-list'))
    })
}

function handleFoodSelect() {
    //Creates click event listeners for list items in '.food-list'
    console.log('handleFoodSelect ran.')
    $('.food-list').on('click', 'li', function() {
        const recipePick = $(this).attr('idMeal');
        renderFoodPick(recipePick);
    })
}

/* ------ Drink ------ */

function handleSpiritSelect() {
    //Creates event listener for spirit submit.
    console.log('handleSpiritSelect ran.')
}

function handleDrinkSelect() {
    //Creates click event listeners for list items in '.drink-list'
    console.log('handleDrinkSelect ran.')
}



/* ------------------------ RENDER FUNCTIONS ---------------------------*/

function renderRecipeList(searchItem, location) {
    console.log('renderRecipeList ran.')

    const url = foodUrl + 'filter.php?a=' + searchItem

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText)
        })
        .then(responseJSON => generateFoodList(responseJSON))
        .then(recipeList => {
            location.empty()
            location.append(recipeList)
        })
        .catch(err => {
            console.log(err);
        })
}

/* ------ Food ------ */

function renderCuisines() {
    //Renders cuisine options
    console.log('renderCuisines ran.')
    
    const url = foodUrl + 'list.php?a=list'
    
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText)
        })
        .then(responseJSON => generateCuisineOptions(responseJSON))
        .then(cuisineOptions => $('#js-cuisines').append(cuisineOptions))
        .catch(err => {
            console.log(err);
        })
    
}

function renderFoodPick(choice) {
    choice = choice.replaceAll(' ', '_')
    
    const url = foodUrl + 'lookup.php?i=' + choice

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText)
        })
        .then(responseJSON => generateFoodRecipe(responseJSON))
        .then(recipe => {
            $('#food-pick').empty();
            $('#food-pick').append(recipe);
        })
        .catch(err => {
            console.log(err);
        })
}

/* ------ Drink------ */

function renderSpirits() {
    //Renders spirit options
    console.log('renderSpirits ran.')
}


function preparePage() {
    //Runs event listenerers and populates drop-down lists
    console.log('preparePage ran.')
    renderCuisines();
    renderSpirits();
    handleCuisineSelect();
    handleSpiritSelect();
    handleFoodSelect();
    handleDrinkSelect();
}

$(preparePage)