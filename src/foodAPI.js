const URL = "https://api.edamam.com/search";
let fetchParam = {
  appId: "8a9271c0",
  appKey: "54266936a0e32d968146b29c6659cdc5",
  q: ""
};

function saveFridgeDB() {
  let name = prompt("Enter fridge name:", "");
  if (!name) return;

  fridgersRef.child(name).set(mealsArray);
}
