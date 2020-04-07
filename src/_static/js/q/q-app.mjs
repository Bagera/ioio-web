import QApp from "/js/q/QApp.mjs";

let app;
const appSelector = ".TicketQueue";
const appSettings = {
  db: window.db,
  subs: [
    { collection: "settings", document: "q" },
    { collection: "users", document: "" },
    { collection: "tickets", document: "", filter: ["active", "==", true] }
  ]
};

function init() {
  const queueEl = document.querySelector(appSelector);
  if (queueEl) {
    if (!app) {
      app = new QApp(appSettings);
    } else {
      app.render();
    }
  }
}

document.addEventListener("turbolinks:load", () => init());

init();
