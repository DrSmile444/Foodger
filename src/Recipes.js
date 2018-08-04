function apiSearch(meals) {
  // forming meals list
  fetchParam.q = meals.join(",");
  let fetchUrl = `${URL}?q=${fetchParam.q}&app_id=${fetchParam.appId}&app_key=${
    fetchParam.appKey
  }`;

  // clearing recipes and setLoader
  clearHtmlNode(recipes);
  setLoader("black loader animated fadeIn block");

  //fetching data
  fetch(fetchUrl)
    .then(response => response.json())
    .then(el => {
      clearHtmlNode("#recipes");
      setLoader("black none");
      console.log(JSON.stringify(el));

      calculateRecipes(el.hits);
    })
    .catch(console.error);
}

window.onload = () => calculateRecipes(saladRecipes.hits);

function calculateRecipes(recipesObj) {
  // if the server didn't find a recipe, we will show error overlay
  // else renders recipes
  if (!recipesObj.length) {
    let emptyMessage =
      "Sorry, we didn't find recipes with this meals for you. :( Try other meals!!!";
    drawEmpty(emptyMessage);
  } else {
    recipesObj.forEach(el => drawRecipe(el.recipe));
  }

  document.location.href = "#recipes";
}

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
      ingiCount = recipe.querySelector(".recipe-ingi-count"),
      ingi = recipe.querySelector(".recipe-info-ingi"),
      linkDetail = recipe.querySelector(".recipe-link__detail"),
      linkOriginal = recipe.querySelector(".recipe-link__original");

    title.innerHTML = el.label;
    image.src = el.image;
    author.innerHTML = el.source;
    diete.innerHTML = calcDietLabels(el.dietLabels);
    calories.innerHTML = amountOfCalories + " cal";
    weight.innerHTML = amountOfWeight + " g";
    ingiCount.innerHTML = el.ingredientLines.length + " " + ingiCount.innerHTML;
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
    red = "#ff683a",
    darkRed = "#ff4040";

  let color;

  if (typeof value === "number") {
    //
    if (value > 2000) color = darkRed;
    else if (value > 1700) color = red;
    else if (value > 1000) color = MOREEEEEEEEEorange;
    else if (value > 800) color = orange;
    else if (value > 500) color = yellow;
    else color = green;
    //
  } else if (typeof value === "object") {
    //
    let low =
      isArrayContain(value, [
        "Low-Carb",
        "Low-Fat",
        "Low-Sodium",
        "Low-Sugar",
        "Alcohol-Free",
        "Vegetarian",
        "Vegan"
      ]) || value.length === 0;
    let medium = isArrayContain(value, [
      "Paleo",
      "High-Fiber",
      "High-Protein",
      "Balanced"
    ]);

    if (low) color = green;
    if (medium) color = yellow;
    //
  } else {
    console.error("calcColor: Unsupported value.");
  }

  return color;
}

function calcDietLabels(array) {
  if (array.length === 0) {
    return "All is well :)";
  } else {
    return array.join(",");
  }
}

function isArrayContain(array, value) {
  if (typeof value === "string") {
    //
    return !!~array.indexOf(value);
    //
  } else if (typeof value === "object") {
    //
    let bool = false;

    for (let i = 0, n = value.length; i < n; i++) {
      let temp = !!~array.indexOf(value[i]);

      if (temp) {
        bool = true;
        break;
      }
    }

    return bool;
    //
  } else {
    console.error("isArrayContain: Unsupported value.");
  }
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
