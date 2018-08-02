const URL = "http://food2fork.com/api/search";
let fetchParam = {
  key: "e874758dfbd86122e50e9c561cf7f2c1",
  q: ""
};

function saveFridgeDB() {
  let name = prompt("Enter fridge name:", "");
  if (!name) return;

  fridgersRef.child(name).set(mealsArray);
  let frigeObject = {};
}
