let DOM = new DOMclass();

importScript("src/Database");
importScript("src/allRecipes");
importScript("src/exampleRecipe");
importScript("src/foodAPI");
importScript("src/Form");
importScript("src/DrawRecipe");
importScript("src/Recipes");

let isMounted = {
  scrollFunctionInverted: true
};

//
// Useful functions
//

function setLoader(classNames) {
  // it sets the loader depending on the argument
  let black = DOM.get(".black");
  black.className = classNames;
}

// Scroll button

function scrollFunction() {
  let scrollButton;
  let scrollHeight = 600;

  if (
    document.body.scrollTop > scrollHeight ||
    document.documentElement.scrollTop > scrollHeight
  ) {
    if (isMounted.scrollFunctionInverted) {
      // it checks whether scroll mounted
      scrollButton = DOM.get("#scrollUp");
      scrollButton.className = "animated slideInLeft";
      scrollButton.style.display = "block";

      isMounted.scrollFunctionInverted = false;
    }
  } else {
    scrollButton = DOM.get("#scrollUp");
    scrollButton.className = "animated bounceOutLeft delay-2s";

    isMounted.scrollFunctionInverted = true;
  }
}

// When the user clicks on the button, scroll to the top of the document
function scrollUp() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
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
