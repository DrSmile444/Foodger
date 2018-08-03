DOM.import("src/styles/Recipe");

function apiSearch(meals) {
  // forming meals list
  fetchParam.q = meals.join(",");
  let fetchUrl = `${URL}?key=${fetchParam.key}&q=${fetchParam.q}`;

  fetchUrl =
    "https://api.edamam.com/search?q=chicken&app_id=8a9271c0&app_key=54266936a0e32d968146b29c6659cdc5";

  // clearing recipes and setLoader
  clearHtmlNode(recipes);
  setLoader("black loader animated fadeIn block");

  //fetching data
  fetch(fetchUrl)
    .then(response => response.json())
    .then(console.log)
    .catch(console.error);
}

window.onload = () => calculateRecipes(allRecipes.hits);

function calculateRecipes(recipesObj) {
  // if the server didn't find a recipe, we will show error overlay
  // else renders recipes
  if (!recipesObj.length) {
    let emptyMessage =
      "Sorry, we didn't find recipe with this meals for you. :( Try another meals!!!";
    drawEmpty(emptyMessage);
  } else {
    console.log(recipesObj);
    recipesObj.forEach(el => drawRecipe(el.recipe));
  }

  document.location.href = "#recipes";
}

// drawRecipe(exampleRecipe);

function drawRecipe(el) {
  if ("content" in DOM.create("template")) {
    let recipeTarget = DOM.get("#recipes");
    let recipeOrigin = DOM.get("#recipe-template");
    let recipe = document.importNode(recipeOrigin.content, true);

    let amountOfCalories = Math.floor(el.calories);
    let amountOfWeight = Math.floor(el.totalWeight);

    let title = recipe.querySelector(".recipe__title"),
      image = recipe.querySelector(".recipe__image"),
      author = recipe.querySelector(".recipe-info__author"),
      diete = recipe.querySelector(".recipe-info__diete"),
      calories = recipe.querySelector(".recipe-info__calories"),
      weight = recipe.querySelector(".recipe-ingo__weight"),
      ingi = recipe.querySelector(".recipe-info-ingi"),
      linkDetail = recipe.querySelector(".recipe-link__detail"),
      linkOriginal = recipe.querySelector(".recipe-link__original");

    title.innerHTML = el.label;
    image.src = el.image;
    author.innerHTML = el.source;
    diete.innerHTML = el.dietLabels.join(",");
    calories.innerHTML = amountOfCalories + " cal";
    weight.innerHTML = amountOfWeight + " g";
    linkDetail.href = el.shareAs;
    linkOriginal.href = el.url;

    diete.style.backgroundColor = calcColor(el.dietLabels);
    calories.style.backgroundColor = calcColor(amountOfCalories);
    weight.style.backgroundColor = calcColor(amountOfWeight);

    for (let i = 0, n = el.ingredientLines.length; i < n; i++) {
      let ingiItem = DOM.create("li");
      ingiItem.innerHTML = el.ingredientLines[i];

      ingi.append(ingiItem);
    }

    recipeTarget.append(recipe);
  } else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
  }
}

function drawEmpty(text) {
  let black = DOM.get(".black");
  black.innerHTML = text;
  black.className = "black animated fadeIn block";

  setTimeout(() => {
    black.className = "black none";
  }, 5000);
}

function calcColor(value) {
  let green = "#73e656",
    yellow = "#e6dc56",
    orange = "#e6a856",
    MOREEEEEEEEEorange = "#e68456",
    red = "#e65656";

  let color;

  if (typeof value === "number") {
    //
    if (value > 1200) color = red;
    else if (value > 800) color = MOREEEEEEEEEorange;
    else if (value > 600) color = orange;
    else if (value > 400) color = yellow;
    else color = green;
    //
  } else if (typeof value === "object") {
    //
    if (!!~value.indexOf("Low-Carb")) color = green;
    if (!!~value.indexOf("High-Protein")) color = yellow;
  }

  return color;
}

function setClass(names) {
  for (let i = 1, n = arguments.length; i < n; i++) {
    arguments[i].className = names[i - 1];
  }
}

function clearHtmlNode(path) {
  let target;

  switch (typeof path) {
    case "string":
      target = DOM.get(path);
      break;
    case "object":
      target = path;
  }

  target.innerHTML = "";
}

function setLoader(classNames) {
  let black = DOM.get(".black");
  black.innerHTML = "";
  black.className = classNames;
}
