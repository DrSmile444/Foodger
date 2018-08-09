function drawRecipe(el) {
  // the function receives an element from the API
  // and then draws it
  let recipeTarget = DOM.get("#recipes");
  let recipeOrigin = DOM.get("#recipe-template");
  let recipe = document.importNode(recipeOrigin.content, true);

  let recipeObject = {
    label: el.label,
    image: el.image,
    source: el.source,
    dietLabels: el.dietLabels ? el.dietLabels : [],
    calories: Math.floor(el.calories),
    totalWeight: Math.floor(el.totalWeight),
    ingredientLines: el.ingredientLines,
    shareAs: el.shareAs,
    url: el.url,
    healthLabels: el.healthLabels
  };

  let recipeCode = getRecipeCode(recipeObject);
  let recipeRoot = recipe.querySelector(".recipe");
  let hideWholeRecipe = recipe.querySelector(".hide-recipe");

  hideWholeRecipe.addEventListener("click", () => {
    recipeRoot.remove();
    drawHideAllRecipes();
  });

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
    health = recipe.querySelector(".recipe-health"),
    hideMobile = recipe.querySelector(".recipe-info-hide");

  // set recipe data
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

  // if the recipe already were added, we will toggle button
  if (allRecipesOnTheServer) {
    if (allRecipesOnTheServer[recipeCode]) {
      _toggleRemoveButton(saveRecipe);
    }
  }

  // if device is mobile phone, we hide recipe list and must show it
  // by click
  if (currentWidth <= 640) {
    ingiCount.addEventListener("click", () => {
      _toggleIngi(ingiCount, ingi, hideMobile);
    });

    hideMobile.addEventListener("click", () => {
      _toggleIngi(ingiCount, ingi, hideMobile, { type: "hide" });
    });
  }

  saveRecipe.setAttribute("data-recipe-code", recipeCode);
  saveRecipe.addEventListener("click", () =>
    saveRecipeEngine(saveRecipe, recipeObject, recipeCode)
  );

  diete.style.backgroundColor = calcColor(el.dietLabels);
  caloriesRecipe.style.backgroundColor = calcColor(recipeObject.calories);
  weight.style.backgroundColor = calcColor(recipeObject.totalWeight);

  // forming ingredients list
  for (let i = 0, n = el.ingredientLines.length; i < n; i++) {
    let ingiItem = DOM.create("li");
    ingiItem.innerHTML = el.ingredientLines[i];

    ingi.append(ingiItem);
  }

  drawHideAllRecipes();

  recipeTarget.append(recipe);
}

function drawHideAllRecipes() {
  let el = DOM.get("[data-hide-all=true]");
  let recipeTarget = DOM.get("#recipes");
  let allRecipes = DOM.getAll(".recipe");

  if (!el) {
    let hideAllOrigin = DOM.get("#hide-all-recipes-template");
    let hideAll = document.importNode(hideAllOrigin.content, true);

    let button = hideAll.querySelector(".hide-all-recipes");

    button.setAttribute("data-hide-all", true);
    button.addEventListener("click", () => clearHtmlNode(recipeTarget));

    recipeTarget.append(button);
  } else {
    if (!allRecipes.length) {
      clearHtmlNode(recipeTarget);
      return "Removed";
    }
  }
}

function drawRecipeFromPreset(key) {
  let el = document.querySelector(`[data-recipe-code="${key}"]`);

  // I check whether it doesn't repeat
  if (!el && allRecipesOnTheServer[key]) {
    let recipesNodes = DOM.getAll(".recipe");
    let recipeRoot = DOM.get("#recipes");

    if (recipesNodes.length > 9) {
      clearHtmlNode(recipeRoot);
    }

    drawRecipe(allRecipesOnTheServer[key]);
  }
}

// useful functions for drawing a recipe

function _toggleRemoveButton(htmlNode) {
  if (htmlNode.innerHTML === "+") {
    htmlNode.innerHTML = "-";
    htmlNode.style.backgroundColor = "#d34040";
  } else {
    htmlNode.innerHTML = "+";
    htmlNode.style.backgroundColor = "#40d345";
  }
}

function _toggleIngi(htmlNode, listNode, hideListNode, prop = {}) {
  // the main purpose of this function is
  // to switch the view list node for the mobile device
  var computedStyle = window.getComputedStyle(htmlNode, null);

  let blue = "rgb(63, 188, 255)";

  if (prop.type !== "hide" && computedStyle.color === blue) {
    htmlNode.style.color = "white";
    htmlNode.style.backgroundColor = blue;

    listNode.style.display = "block";
    hideListNode.style.display = "block";
  } else {
    htmlNode.style.color = blue;
    htmlNode.style.backgroundColor = "white";

    listNode.style.display = "none";
    hideListNode.style.display = "none";
  }
}

function drawEmpty(text = "Something goes wrong!") {
  // it draws a message with specific text for the user
  let black = DOM.get(".black");
  let loader = DOM.get(".loader");
  let textContainer = DOM.get(".black-text");

  textContainer.innerHTML = text;
  textContainer.className = "black-text flex";
  black.className = "black animated fadeIn flex";
  loader.className = "none";

  black.addEventListener(
    "click",
    function _hideOverlay() {
      black.className = "black none";
      black.removeEventListener("click", _hideOverlay, true);
      unMountText();
    },
    true
  );

  setTimeout(() => {
    unMountText();
  }, 5000);

  function unMountText() {
    black.className = "black none";
    textContainer.className = "black-text none";
    loader.className = "loader";
  }
}

function calcColor(value = 0) {
  // it needs to calculate a color
  // depending on the value
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
    let lowArray = [
      "Low-Carb",
      "Low-Fat",
      "Low-Sodium",
      "Low-Sugar",
      "Alcohol-Free",
      "Vegetarian",
      "Vegan"
    ];

    let mediumArray = ["Paleo", "High-Fiber", "High-Protein", "Balanced"];
    //
    let low = isArrayContain(value, lowArray) || value.length === 0;
    let medium = isArrayContain(value, mediumArray);

    if (low) color = green;
    if (medium) color = yellow;
    //
  } else {
    console.error("calcColor: Unsupported value.", typeof value);
  }

  return color;
}

function calcDietLabels(array = [], text) {
  // the function returns a diet label text
  // sometimes the array is empty and we need show
  // an another text
  if (array.length === 0) {
    return text;
  } else {
    return array.join(", ");
  }
}

function isArrayContain(array, value) {
  // the function checks whether the array has the value
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
    console.error("isArrayContain: Unsupported value.", typeof value);
  }
}

function setClass(names) {
  // the function gets an array of class names
  // and then sets it to arguments
  for (let i = 1, n = arguments.length; i < n; i++) {
    arguments[i].className = names[i - 1];
  }
}
