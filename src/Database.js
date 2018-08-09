let database = firebase.database();
let fridgersRef = database.ref("/frigers/");
let recipesRef = database.ref("/recipes/");

fridgersRef.on("value", function(data) {
  clearHtmlNode(".fridges__presets");

  let value = data.val();

  if (value) {
    let fridgersKeys = Object.keys(value);

    fridgersKeys.forEach(el => {
      let data = {
        type: "ADD_MEALS_LIST",
        name: `${el} - ${value[el]}`,
        key: el,
        htmlTarget: ".fridges__presets",
        htmlTemplate: "#item-template",
        firebase: "/frigers/"
      };

      appendFridgeItem(data);
    });
  }
});

recipesRef.on("value", function(data) {
  clearHtmlNode(".recipe__presets");

  let value = data.val();

  if (value) {
    let recipesKey = Object.keys(value);

    recipesKey.forEach(el => {
      let data = {
        type: "ADD_RECIPES_LIST",
        name: value[el].label,
        key: el,
        htmlTarget: ".recipe__presets",
        htmlTemplate: "#item-template",
        firebase: "/recipes/"
      };

      appendFridgeItem(data);
    });
  }
});

class Fire {
  constructor() {
    this.state = {};
  }

  removeNode(path) {
    return database.ref(path).remove();
  }

  setNode(path, data) {
    return database.ref(path).set(data);
  }

  pushNode(path, data) {
    return database.ref(path).push(data);
  }
}

let fire = new Fire();
