import Lib from "/js/lib/Lib.mjs";

const appSelector = ".Lib";
const appSettings = {
  db: window.db,
  subs: [
    { collection: "settings", document: "q" },
    { collection: "users", document: "" },
    { collection: "loans", document: "", filter: ["active", "==", true] }
  ]
};
let app;

function init() {
  const appEl = document.querySelector(appSelector);
  if (appEl) {
    if (!app) {
      app = new Lib(appSettings);
    } else {
      app.render();
    }
  }
}

document.addEventListener("turbolinks:load", () => init());

init();
