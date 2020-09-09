import QList from "/js/q/QList.mjs";

let app;
const appSelector = ".TicketQueue";
const appSettings = {
  db: window.db,
  subs: [
    { collection: "settings", document: "q" },
    { collection: "users", document: "" },
    { collection: "tickets", document: "", filter: ["active", "==", true] },
    { collection: "info", document: "", filter: ["active", "==", true] },
  ],
};

function init() {
  const queueEl = document.querySelector(appSelector);
  if (queueEl) {
    if (!app) {
      app = new QList(appSettings);
    } else {
      app.render();
    }
  }
  setTimeout(() => {
    location.reload();
  }, 5000);
}

document.addEventListener("turbolinks:load", () => init());

init();
