let database = firebase.database();
let fridgersRef = database.ref("/frigers/");
let usersRef = database.ref("/users/");
let recipesRef = database.ref("/recipes/");

setLoader("black show-loader animated flex");

window.onload = () => toggleRecipes();

//
// Checking whether user login
//

firebase.auth().onAuthStateChanged(function(user) {
  setLoader("black none");

  user ? isAlreadyAuth() : logIn();
});

//
// is Login body
//

function logIn() {
  _hideUI();

  let loginTarget = DOM.get("body");
  let loginOrigin = DOM.get("#login-template");
  let login = document.importNode(loginOrigin.content, true);

  loginTarget.append(login);
}

//
// is Login Functions
//

function _authWithGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: "select_account"
  });

  firebase
    .auth()
    .signInWithPopup(provider)
    .then(result => _updateUserInfo(result.user))
    .catch(console.error);
}

function _updateUserInfo({ uid, displayName, photoURL, email }) {
  localStorage.setItem("uid", uid);
  localStorage.setItem("displayName", displayName);
  localStorage.setItem("photoURL", photoURL);

  let info = { displayName, photoURL, email };

  usersRef.child(uid).on("value", data => {
    let userData = data.val() || {};

    usersRef
      .child(uid)
      .set({ ...userData, info })
      .catch(console.error);
  });
}

function _logout() {
  firebase
    .auth()
    .signOut()
    .catch(console.error);
}

function _setRefs() {
  let uid = localStorage.getItem("uid");

  fridgersRef = database.ref(`/users/${uid}/fridgers/`);
  recipesRef = database.ref(`/users/${uid}/recipes/`);
}

function _hideUI() {
  document.body.style.background = 'url("assets/login-wallpaper.jpg")';
  let app = DOM.get("#app");
  let nav = DOM.get("nav");

  app.className = "none";
  nav.className = "none";
}

//
// is Auth body
//

function isAlreadyAuth() {
  _setRefs();
  _clearUI();

  let loginForm = DOM.get("#login");
  if (loginForm) loginForm.remove();

  let userObj = {
    displayName: localStorage.getItem("displayName"),
    photoURL: localStorage.getItem("photoURL")
  };

  _drawUserInfo(userObj);
  _setRefDatabase();
  _setWindow();
  _showUI();
}

//
// is Auth Functions
//

function _setRefDatabase() {
  // Changing values from the database
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
          firebase: fridgersRef
        };

        appendFridgeItem(data);
      });
    }
  });

  recipesRef.on("value", function(data) {
    allRecipesOnTheServer = data.val();
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
          firebase: recipesRef
        };

        appendFridgeItem(data);
      });
    }
  });
}

function _drawUserInfo(user) {
  let userTarget = DOM.get("#user-container");
  let userOrigin = DOM.get("#user-info-template");
  let userNode = document.importNode(userOrigin.content, true);

  let img = userNode.querySelector(".user-info-image__image");
  let text = userNode.querySelector(".user-data__text");

  img.src = user.photoURL;
  text.innerHTML = user.displayName;

  clearHtmlNode(userTarget);
  userTarget.append(userNode);
}

function _setWindow() {
  // draws recipes for test

  setTimeout(() => {
    // calculateRecipes(cherryFlour.hits);
  }, 1000);

  window.onscroll = function() {
    scrollFunction();
  };
}

function _showUI() {
  document.body.style.background = 'url("assets/login-wallpaper-faded.jpg")';
  DOM.get("nav").className = "";
  DOM.get("#app").className = "";
}

function _clearUI() {
  let recipes = DOM.get("#recipes");
  let meals = DOM.get(".meals");

  clearHtmlNode(recipes);
  clearHtmlNode(meals);

  mealsArray = [];
}

function saveFridgeDB() {
  let name = prompt("Enter fridge name:", "");
  if (!name) return;

  fridgersRef.child(name).set(mealsArray);
}

//
// firebase class for better access
//

class Fire {
  constructor() {
    this.state = {};
  }

  removeNode(path) {
    if (typeof path === "object") {
      return path.remove();
    }

    return database.ref(path).remove();
  }

  setNode(path, data) {
    if (typeof path === "object") {
      return path.set(data);
    }

    return database.ref(path).set(data);
  }

  pushNode(path, data) {
    if (typeof path === "object") {
      return path.push(data);
    }

    return database.ref(path).push(data);
  }
}

let fire = new Fire();
