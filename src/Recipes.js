DOM.import("src/styles/Recipe");

function apiSearch(meals) {
  // forming meals list
  fetchParam.q = meals.join(",");
  let fetchUrl = `${URL}?key=${fetchParam.key}&q=${fetchParam.q}`;

  // clearing recipes and setLoader
  clearHtmlNode(recipes);
  setLoader("black loader animated fadeIn block");

  //fetching data
  fetch(fetchUrl)
    .then(response => response.json())
    .then(el => {
      clearHtmlNode("#recipes");
      setLoader("black none");

      calculateRecipes(el);
    })
    .catch(console.error);
}

function calculateRecipes(recipesObj) {
  // if server didn't find recipe, we will show error overlay
  // else renders recipes
  if (!recipesObj.recipes.length) {
    let emptyMessage =
      "Sorry, we didn't find recipe with this meals for you. :( Try another meals!!!";
    drawEmpty(emptyMessage);
  } else {
    recipesObj.recipes.forEach(el => drawRecipe(el));
  }

  document.location.href = "#recipes";
}

function drawRecipe(el) {
  let recipeTarget = DOM.get("#recipes");
  let container = DOM.create("div"),
    title = DOM.create("h1"),
    image = DOM.create("img"),
    rank = DOM.create("p"),
    linkFork = DOM.create("a"),
    linkOriginal = DOM.create("a"),
    wrappingLinks = DOM.create("div"),
    wrappingFooter = DOM.create("div");

  // getting info
  title.innerHTML = el.title;
  image.src = el.image_url;
  rank.innerHTML = Math.floor(el.social_rank);
  linkFork.href = el.f2f_url;
  linkFork.innerHTML = "Fork2Foodr";
  linkOriginal.href = el.source_url;
  linkOriginal.innerHTML = el.publisher;

  // getting clasess
  let classNames = [
    "recipe animated zoomInUp",
    "recipe__title",
    "recipe__image",
    "recipe__rank",
    "recipe__link fork",
    "recipe__link original",
    "recipe__linksWrapper",
    "recipe__footer"
  ];

  setClass(
    classNames,
    container,
    title,
    image,
    rank,
    linkFork,
    linkOriginal,
    wrappingLinks,
    wrappingFooter
  );

  // wrappingLinks.append();
  wrappingFooter.append(rank, linkFork, linkOriginal);

  container.append(title, image, wrappingFooter);
  recipeTarget.append(container);
}

function drawEmpty(text) {
  let black = DOM.get(".black");
  black.innerHTML = text;
  black.className = "black animated fadeIn block";

  setTimeout(() => {
    black.className = "black none";
  }, 5000);
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
  black.innerHTML = "";
  black.className = classNames;
}
