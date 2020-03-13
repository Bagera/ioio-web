import Q from "/js/q/Q.mjs";

let qApp;

function init(onLoad) {
  const queueEl = document.querySelector(".TicketQueue");
  if (queueEl) {
    if (!qApp) {
      qApp = new Q(queueEl);
    } else {
      qApp.render();
    }
  }
}

document.addEventListener("turbolinks:load", () => init());
