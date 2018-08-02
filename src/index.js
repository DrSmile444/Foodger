let DOM = new DOMclass();

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

  script.src = path + ".js";
  return target.appendChild(script);
}
