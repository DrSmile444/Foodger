let DOM = new DOMclass();
DOM.import("./src/styles/Meals");
DOM.import("src/styles/Recipe");

importScript("src/allRecipes");
importScript("src/exampleRecipe");
importScript("src/foodAPI");
importScript("src/Database");
importScript("src/Form");
importScript("src/Recipes");

//
// Script loader
//

function importScript(path) {
  let target = document.querySelector("#scripts");
  let script = document.createElement("script");

  script.defer = true;
  script.src = path + ".js";
  return target.appendChild(script);
}
