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
    // calculateRecipes(saladRecipes.hits);
    toggleRecipes();
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

function setLoader(classNames) {
  // it sets the loader depending on the argument
  let black = DOM.get(".black");
  black.className = classNames;
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
      code += _returnChar(singleField);
    } else if (type === "object") {
      singleField.forEach(el => {
        code += _returnChar(el) + _returnChar(el, 4);
      });
    }
  });

  // filter "/" because it breaks the database object
  code = code
    .split("")
    .filter(el => el !== "/" && el !== ".")
    .join("");

  return code;
}

function _returnChar(string, index = "last") {
  string = string + "";

  if (index === "last") {
    index = string.length - 1;
  }

  return string[index];
}
