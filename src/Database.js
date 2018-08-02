let database = firebase.database();
let fridgersRef = database.ref("/frigers/");

fridgersRef.on("value", function(data) {
  clearHtmlNode(".fridges__presets");

  let fridgersKeys = Object.keys(data.val());

  fridgersKeys.forEach(el => {
    appendFridge(`${el} - ${data.val()[el]}`, el);
  });
});
