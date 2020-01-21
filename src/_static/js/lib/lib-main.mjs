import Lib from "/js/lib/Lib.mjs";

let windowLoad = false;

const libAppOptions = {
  subs: [
    { collection: "settings", document: "q" },
    { collection: "users", document: "" },
    { collection: "loans", document: "" }
  ]
};

function init(onLoad) {
  const appContainer = document.querySelector(".Lib");
  if (!windowLoad) {
    if (appContainer) {
      const libApp = new Lib(libAppOptions);
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
