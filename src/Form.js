let submitFridge = DOM.get(".add-meals__submit");
let inputFood = DOM.get(".add-meals__input");
let searchFood = DOM.get(".add-meals__search");
let foodTarget = DOM.get(".meals");

let currentWidth = Math.max(
  document.documentElement.clientWidth,
  window.innerWidth || 0
);

let mealsArray = [];

submitFridge.addEventListener("click", saveFridgeDB);
inputFood.addEventListener("keyup", inputSubmit);
searchFood.addEventListener("click", () => apiSearch(mealsArray));

// DOM manipulation

function inputSubmit(event) {
  if (event.key === "Enter") {
    let text = inputFood.value.trim().toLowerCase();
    inputFood.value = "";

    if (!text || !!~mealsArray.indexOf(text)) {
      return;
    }

    appendFood(text);
    appendFoodCleaner();
  }
}

function appendFood(text, mealClass = "", flag = true) {
  let meal = DOM.create("div");
  meal.innerHTML = text;
  meal.className = "animated bounceIn " + mealClass;
  meal.addEventListener("click", () => deleteFood(meal));

  if (flag) {
    mealsArray.push(text);
  }

  foodTarget.appendChild(meal);
}

function appendFoodCleaner() {
  let pastCleaner = DOM.get(".meals__cleaner");
  if (pastCleaner) {
    pastCleaner.remove();
  }

  if (mealsArray.length > 1) {
    // creating delete el
    appendFood("Delete All", "meals__cleaner", false);

    //cleaning elements
    let cleaner = DOM.get(".meals__cleaner");
    cleaner.addEventListener("click", () => {
      clearHtmlNode(foodTarget);
      mealsArray = [];
    });
  }
}

function appendFridgeItem(data) {
  let itemTarget = DOM.get(data.htmlTarget);
  let itemOrigin = DOM.get(data.htmlTemplate);
  let item = document.importNode(itemOrigin.content, true);

  let container = item.querySelector(".item");
  let textZone = item.querySelector(".item-text");
  let remove = item.querySelector(".item-remove");
  let removeText = item.querySelector(".item-remove__text");

  container.title = data.name;
  data.name = truncate(data.name, Math.floor(currentWidth / 20));

  // delete item preset
  remove.addEventListener("click", () => {
    //

    fire.removeNode(data.firebase.child(data.key)).then(() => {
      if (data.type === "ADD_RECIPES_LIST") {
        let el = document.querySelector(`[data-recipe-code="${data.key}"]`);

        if (el) {
          _toggleRemoveButton(el);
        }
      }
    });
    //
  });

  // display and hide the button "remove the fridge"
  container.addEventListener("click", () => {
    if (data.type === "ADD_MEALS_LIST") {
      createFormList(data.firebase, data.key);
    } else if (data.type === "ADD_RECIPES_LIST") {
      drawRecipeFromPreset(data.key);
    }
  });

  container.addEventListener("mousemove", () => {
    remove.style.display = "flex";
  });

  container.addEventListener("mouseout", () => {
    if (currentWidth > 800) {
      remove.style.display = "none";
    }
  });

  container.className = "animated pulse fridge";
  remove.className = "animated tada remove-button";

  textZone.innerText = data.name;
  removeText.innerHTML = "x";

  itemTarget.appendChild(container);
}

function createFormList(path, key) {
  path.child(key).on("value", function(data) {
    let tempMealsArray = data.val();
    let isDeleted = tempMealsArray === null;

    if (!isDeleted) {
      tempMealsArray.forEach(el => {
        if (!~mealsArray.indexOf(el)) {
          appendFood(el);
        }
      });
      appendFoodCleaner();
    }
  });
}

function toggleRecipes() {
  let toggleButton = DOM.get(".recipes-toggler");
  let toggleText = DOM.get(".recipes-toggler__text");
  let recipesNode = DOM.get(".recipe__presets");

  toggleButton.style.display = "block";

  toggleButton.addEventListener("click", () => {
    let computedStyle = window.getComputedStyle(recipesNode, null);

    if (computedStyle.display === "none") {
      recipesNode.style.display = "flex";
      toggleText.innerHTML = "Hide recipes";
    } else {
      recipesNode.style.display = "none";
      toggleText.innerHTML = "Show recipes";
    }
  });
}

function deleteFood(name) {
  mealsArray = mealsArray.filter(el => el !== name.innerHTML);
  if (mealsArray.length === 0) {
    appendFoodCleaner();
  }

  if (mealsArray.length === 1) {
    appendFoodCleaner();
  }

  name.remove();
}

function truncate(str, maxlength) {
  maxlength = maxlength > 40 ? 40 : maxlength;
  return str.length > maxlength ? str.slice(0, maxlength - 3) + "..." : str;
}
