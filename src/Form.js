let submitFridge = DOM.get(".add-meals__submit");
let inputFood = DOM.get(".add-meals__input");
let searchFood = DOM.get(".add-meals__search");
let foodTarget = DOM.get(".meals");

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

function appendFridge(name, key) {
  let fridge = DOM.get(".fridges__presets");

  let item = DOM.create("div");

  if (name.length > 40) {
    name = name.slice(0, 40) + "...";
  }

  item.innerHTML = name;
  item.addEventListener("click", () => createFoodList(key));

  fridge.appendChild(item);
}

function createFoodList(key) {
  fridgersRef.child(key).on("value", function(data) {
    let tempMealsArray = data.val();

    tempMealsArray.forEach(el => {
      if (!~mealsArray.indexOf(el)) {
        appendFood(el);
      }
    });
    appendFoodCleaner();
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
