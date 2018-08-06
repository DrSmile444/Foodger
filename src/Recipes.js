let addedRecipe = [];

function apiSearch(meals) {
  // forming meals list
  fetchParam.q = meals.join(",");
  let fetchUrl = `${URL}?q=${fetchParam.q}&app_id=${fetchParam.appId}&app_key=${
    fetchParam.appKey
  }`;

  // clearing recipes and setLoader
  clearHtmlNode(recipes);
  setLoader("black show-loader animated fadeIn flex");

  //fetching data

  // setTimeout(() => {
  //   setLoader("black none");
  // }, 2000);

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
  let emptyMessage =
    "Sorry, we didn't find recipes with this meals for you. :( Try other meals!!!";
  let errorMessage = "Sorry, your browser doesn't support this app :(";
  if (!recipesObj.length) {
    drawEmpty(emptyMessage);
  } else {
    if ("content" in DOM.create("template")) {
      recipesObj.forEach(el => drawRecipe(el.recipe));
    } else {
      drawEmpty(errorMessage);
    }
  }

  document.location.href = "#recipes";
}

function drawRecipe(el) {
  let recipeTarget = DOM.get("#recipes");
  let recipeOrigin = DOM.get("#recipe-template");
  let recipe = document.importNode(recipeOrigin.content, true);

  let recipeObject = {
    label: el.label,
    image: el.image,
    source: el.source,
    dietLabels: el.dietLabels,
    calories: Math.floor(el.calories),
    totalWeight: Math.floor(el.totalWeight),
    ingredientLines: el.ingredientLines,
    shareAs: el.shareAs,
    url: el.url,
    healthLabels: el.healthLabels
  };

  let title = recipe.querySelector(".recipe__title"),
    imageRecipe = recipe.querySelector(".recipe__image"),
    author = recipe.querySelector(".recipe-info__author"),
    diete = recipe.querySelector(".recipe-info__diete"),
    caloriesRecipe = recipe.querySelector(".recipe-info__calories"),
    weight = recipe.querySelector(".recipe-ingo__weight"),
    ingiCount = recipe.querySelector(".recipe-ingi-count"),
    ingi = recipe.querySelector(".recipe-info-ingi"),
    linkDetail = recipe.querySelector(".recipe-link__detail"),
    linkOriginal = recipe.querySelector(".recipe-link__original"),
    saveRecipe = recipe.querySelector(".recipe-link__save-recipe"),
    health = recipe.querySelector(".recipe-health");

  title.innerHTML = el.label;
  imageRecipe.src = el.image;
  author.innerHTML = el.source;
  diete.innerHTML = calcDietLabels(el.dietLabels, "No diet :)");
  caloriesRecipe.innerHTML = recipeObject.calories + " cal";
  weight.innerHTML = recipeObject.totalWeight + " g";
  ingiCount.innerHTML = el.ingredientLines.length + " " + ingiCount.innerHTML;
  linkDetail.href = el.shareAs;
  linkOriginal.href = el.url;
  health.innerHTML = calcDietLabels(el.healthLabels, "");

  saveRecipe.addEventListener("click", () =>
    saveRecipeEngine(saveRecipe, recipeObject)
  );

  diete.style.backgroundColor = calcColor(el.dietLabels);
  caloriesRecipe.style.backgroundColor = calcColor(recipeObject.calories);
  weight.style.backgroundColor = calcColor(recipeObject.totalWeight);

  for (let i = 0, n = el.ingredientLines.length; i < n; i++) {
    let ingiItem = DOM.create("li");
    ingiItem.innerHTML = el.ingredientLines[i];

    ingi.append(ingiItem);
  }

  recipeTarget.append(recipe);
}

function saveRecipeEngine(htmlNode, recipe) {
  if (htmlNode.innerHTML === "+") {
    fire.pushNode(`/recipes/`, recipe).then(el => {
      htmlNode.innerHTML = "-";
      htmlNode.style.backgroundColor = "#d34040";

      addedRecipe.push(htmlNode, el.path.pieces_[1]);
    });
  } else {
    let index = addedRecipe.indexOf(htmlNode);

    if (!!~index) {
      let node = addedRecipe[index];
      let url = addedRecipe[index + 1];

      fire.removeNode(`/recipes/${url}`).then(() => {
        htmlNode.innerHTML = "+";
        htmlNode.style.backgroundColor = "#40d345";

        addedRecipe = addedRecipe.filter(el => el !== node && el !== url);
      });
    }
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

function calcDietLabels(array, text) {
  if (array.length === 0) {
    return text;
  } else {
    return array.join(", ");
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
  // black.innerHTML = "";
  black.className = classNames;
}
