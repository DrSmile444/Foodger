let allRecipesOnTheServer;

recipesRef.on("value", function(data) {
  allRecipesOnTheServer = data.val();
});

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

// draws recipes for test
window.onload = () => {
  setTimeout(() => {
    calculateRecipes(saladRecipes.hits);
  }, 1000);
};

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
  // the function receives an element from the API
  // and then draws it
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

  let recipeCode = getRecipeCode(recipeObject);

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
    hide = recipe.querySelector(".recipe-info-hide");

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
      _toggleIngi(ingiCount, ingi, hide);
    });

    hide.addEventListener("click", () => {
      _toggleIngi(ingiCount, ingi, hide, { type: "hide" });
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

  recipeTarget.append(recipe);
}

// useful functions for drawing a recipe

function saveRecipeEngine(htmlNode, recipe, name) {
  // depending on the value of the htmlNode
  // the function will add or delete a node at the database
  if (htmlNode.innerHTML === "+") {
    fire.setNode(`/recipes/${name}`, recipe).then(() => {
      _toggleRemoveButton(htmlNode);
    });
  } else {
    fire.removeNode(`/recipes/${name}`).then(() => {
      _toggleRemoveButton(htmlNode);
    });
  }
}

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

function setLoader(classNames) {
  // it sets the loader depending on the argument
  let black = DOM.get(".black");
  black.className = classNames;
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

function calcColor(value) {
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
    console.error("calcColor: Unsupported value.");
  }

  return color;
}

function calcDietLabels(array, text) {
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
    console.error("isArrayContain: Unsupported value.");
  }
}

function setClass(names) {
  // the function gets an array of class names
  // and then sets it to arguments
  for (let i = 1, n = arguments.length; i < n; i++) {
    arguments[i].className = names[i - 1];
  }
}

function clearHtmlNode(path) {
  // delete the node on the specified path
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

// Forming recipe secret code
function getRecipeCode(recipe) {
  // returns specified recipe code
  let code = "";
  let fields = Object.keys(recipe);

  code += recipe.label.slice(0, 3);

  fields.forEach(el => {
    let singleField = recipe[el];
    let type = typeof singleField;

    if (type === "string" || type === "number") {
      code += returnChar(singleField);
    } else if (type === "object") {
      singleField.forEach(el => {
        code += returnChar(el) + returnChar(el, 4);
      });
    }
  });

  // filter "/" because it breaks the database object
  code = code
    .split("")
    .filter(el => el !== "/")
    .join("");

  return code;
}

function returnChar(string, index = "last") {
  string = string + "";

  if (index === "last") {
    index = string.length - 1;
  }

  return string[index];
}
