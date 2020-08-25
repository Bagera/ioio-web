import QAdmin from "/js/q/QAdmin.mjs";

let app;
const appSelector = ".QAdmin";
const appSettings = {
  db: window.db,
  subs: [
    { collection: "settings", document: "q" },
    { collection: "users", document: "" },
    { collection: "tickets", document: "", filter: ["active", "==", true] },
  ],
};

function init() {
  const queueEl = document.querySelector(appSelector);
  if (queueEl) {
    if (!app) {
      app = new QAdmin(appSettings);
    } else {
      app.render();
    }
  }
}

document.addEventListener("turbolinks:load", () => init());

init();
