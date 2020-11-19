'use strict'


const foodUrl = 'https://www.themealdb.com/api/json/v1/1/'

const drinkUrl = 'https://www.thecocktaildb.com/api/json/v1/1/'

const spirits = ['Tequila', 
                'Vodka', 
                'Champagne', 
                'Gin', 
                'Rum', 
                'Whiskey', 
                'Light Rum', 
                'Dark Rum', 
                'Spiced Rum', 
                'Bourbon', 
                'Blended whiskey', 
                'Irish Whiskey', 
                'Scotch', 
                'Sweet Vermouth', 
                'Dry Vermouth']
            




/* ------------------------ GENERATE FUNCTIONS ---------------------------*/

function generateOptionElement(option) {
    return `<option value="${option}">${option}</option>`
}

function generateIngredients(recipe) {
    let ingredientList = ``
    const ing = 'strIngredient'
    const meas = 'strMeasure'
    let c = 1
    let curIng = ing + c
    let curMeas= meas + c
    while (recipe[curIng]) {
        if (recipe[curMeas]) {
            ingredientList += `<li>${recipe[curMeas]} ${recipe[curIng]}</li>`
        } else {
            ingredientList += `<li>${recipe[curIng]}</li>`
        }
        
        c++
        curIng = ing + c, curMeas = meas + c
    } 
    return ingredientList
}

/* ------ Food ------ */

function generateFoodListElement(option, delay) {
    return `<li><button class="recipe-list-item" style="animation-delay:${delay}s" idMeal="${option.idMeal}">${option.strMeal}</button></li>`
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
    
    const recipes = response.meals
    let recipeList = ''
    const delayInc = 1/recipes.length
    let delay = 0

    for(let i = 0; i < recipes.length; i++) {
        recipeList += generateFoodListElement(recipes[i], delay)
        delay += delayInc
    }
    return recipeList
}

function generateVideoButton(videoLink) {
    let result = ``
    if (videoLink.length > 0) {
        result += `<a href="${videoLink}" target="_blank"><button class="recipe-video">Video</button></a>`
    }
    return result
}


function generateFoodRecipe(response) {
    const recipe = response.meals[0];
    const ingredients = generateIngredients(recipe)
    const video = generateVideoButton(recipe.strYoutube)
    
    return `<h3 class="recipe-title">${recipe.strMeal}</h3>
            <div class="image-ingredient-wrapper">
                <img class="recipe-image" src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <ul class="recipe-ingredients">
                    ${ingredients}
                </ul>
            </div>
            <p class="recipe-instructions">${recipe.strInstructions}</p>
            ${video}`
}

/* ------ Drink ------ */

function generateDrinkListElement(option, delay) {
    return `<li><button class="recipe-list-item" style="animation-delay:${delay}s" idDrink="${option.idDrink}">${option.strDrink}</button></li>`
}

function generateDrinkList(response) {
    const recipes = response.drinks
    let recipeList = ''
    const delayInc = 1/recipes.length
    let delay = 0


    for(let i = 0; i < recipes.length; i++) {
        recipeList += generateDrinkListElement(recipes[i], delay)
        delay += delayInc
    }

    return recipeList
}

function generateDrinkRecipe(response) {
    const recipe = response.drinks[0];
    const ingredients = generateIngredients(recipe)
    return `<h3 class="recipe-title">${recipe.strDrink}</h3>
            <div class="image-ingredient-wrapper">
                <img class="recipe-image" src="${recipe.strDrinkThumb}" alt="${recipe.strDrink}">
                <ul class="recipe-ingredients">
                    ${ingredients}
                </ul>
            </div>
            <div class="recipe-instructions">
                <p class="recipe-glass">Recommended Glass: ${recipe.strGlass}</p>
                <p>${recipe.strInstructions}</p>
            </div>`
            
}






/* ------------------------ RENDER FUNCTIONS ---------------------------*/

function recipeUpdateActions(recipeElements, pick, image) {
    $(pick).removeClass('visible')
    $(pick).empty();
    $(pick).append(recipeElements);
    $(image).on("load", function() {
        $(pick).removeAttr('style');
        document.querySelector(pick).scrollIntoView({ 
            behavior: 'smooth' 
        });
        $(pick).addClass('visible');
    });
}

/* ------ Food ------ */

function renderCuisines() {
    //Renders cuisine options
    
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

function renderFoodRecipeList(searchItem, location) {

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
        .then(recipe => recipeUpdateActions(recipe, '#food-pick', '.recipe-image'))
        .catch(err => {
            console.log(err);
        })
}

/* ------ Drink------ */

function renderSpirits() {
    //Renders spirit options
    for (let i = 0; i < spirits.length; i++) {
        $('#js-spirits').append(generateOptionElement(spirits[i]))
    }
}

function renderDrinkRecipeList(searchItem, location) {
    searchItem = searchItem.replaceAll(' ', '_')

    const url = drinkUrl + 'filter.php?i=' + searchItem

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText)
        })
        .then(responseJSON => generateDrinkList(responseJSON))
        .then(recipeList => {
            location.empty()
            location.append(recipeList)
        })
        .catch(err => {
            console.log(err);
        })
}

function renderDrinkPick(choice) {
    choice = choice.replaceAll(' ', '_')
    
    const url = drinkUrl + 'lookup.php?i=' + choice

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText)
        })
        .then(responseJSON => generateDrinkRecipe(responseJSON))
        .then(recipe => recipeUpdateActions(recipe, '#drink-pick', '.recipe-image'))
        .catch(err => {
            console.log(err);
        })
}

/* ------------------------ EVENT HANDLERS ---------------------------*/

function scrollFade() {
    $(window).scroll(function() {
        let pageTop = $(document).scrollTop();
        let downBottom = pageTop + ($(window).height()*.95);
    
        if ($('#food').position().top  < downBottom){
            $('#food').addClass("visible");
            } else {
            $('#food').removeClass("visible");
        }
    
        if ($('#drink').position().top  < downBottom){
            $('#drink').addClass("visible");
            } else {
            $('#drink').removeClass("visible");
        }
    })
}


/* ------ Food ------ */

function handleCuisineSelect() {
    //Creates event listener for cuisine submit.
    $('#js-food-form select').change(event => {
        event.preventDefault();
        const cuisineChoice = $('#js-cuisines').val()
        renderFoodRecipeList(cuisineChoice, $('.food-list'))
    })
}

function handleFoodSelect() {
    //Creates click event listeners for list items in '.food-list'
    $('.food-list').on('click', 'button', function() {
        const recipePick = $(this).attr('idMeal');
        renderFoodPick(recipePick);
    })
}

/* ------ Drink ------ */

function handleSpiritSelect() {
    //Creates event listener for spirit submit.
    $('#js-drink-form select').change(event => {
        event.preventDefault();
        const spiritChoice = $('#js-spirits').val()
        renderDrinkRecipeList(spiritChoice, $('.drink-list'))
    })
}

function handleDrinkSelect() {
    //Creates click event listeners for list items in '.drink-list'
    $('.drink-list').on('click', 'button', function() {
        const recipePick = $(this).attr('idDrink');
        renderDrinkPick(recipePick);
    })
}




function preparePage() {
    //Runs event listenerers and populates drop-down lists
    renderCuisines();
    renderSpirits();
    handleCuisineSelect();
    handleSpiritSelect();
    handleFoodSelect();
    handleDrinkSelect();
    scrollFade();
}

$(preparePage)