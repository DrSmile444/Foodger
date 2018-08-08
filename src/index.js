let DOM = new DOMclass();

importScript("src/allRecipes");
importScript("src/exampleRecipe");
importScript("src/foodAPI");
importScript("src/Database");
importScript("src/Form");
importScript("src/DrawRecipe");
importScript("src/Recipes");

//
// Script loader
//

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

function importScript(path) {
  let target = document.querySelector("#scripts");
  let script = document.createElement("script");

  script.defer = true;
  script.src = path + ".js";
  return target.appendChild(script);
}
