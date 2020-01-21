import Q from "/js/q/Q.mjs";

let windowLoad = false;

function init(onLoad) {
  const queueEl = document.querySelector(".TicketQueue");
  if (!windowLoad) {
    if (queueEl) {
      const qApp = new Q(queueEl);
    }
  }
  // Reset variable used to avoid double init first time
  // This relies on turbolinks:load always being fired after
  // window load event
  if (onLoad) {
    windowLoad = true;
  } else {
    windowLoad = false;
  }
}

document.addEventListener("turbolinks:load", () => init());
window.addEventListener("load", () => init(true));
