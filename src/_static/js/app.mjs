import { makeSubId } from "/js/Utils.mjs";

import State from "/js/State.mjs";
import DB from "/js/DB.mjs";
import User from "/js/User.mjs";

import LoginModal from "/js/modal/LoginModal.mjs";
import RegistrationModal from "/js/modal/RegistrationModal.mjs";

const subs = [
  { collection: "settings", document: "q" },
  { collection: "users", document: "" },
  { collection: "roles", document: "" },
  { collection: "tickets", document: "", filter: ["active", "==", true] },
];

let initialized = false;
window.db = new DB(firebase, firebaseConfig);

const appState = new State(subs);

window.addEventListener("userupdate", ({ detail }) => {
  if (appState.isLoaded()) {
    update();
  }
});

const user = new User({ auth: firebase.auth(), db: window.db });
const loginModal = new LoginModal({ user });
const registrationModal = new RegistrationModal({ user });

subs.forEach((sub) => {
  const dataType = sub.document ? sub.document : sub.collection;
  let subId = makeSubId([sub.collection, sub.document], sub.filter);

  window.db.subscribe(sub.collection, sub.document, sub.filter);
  window.addEventListener("snapshot", ({ detail }) => {
    if (detail.subId === subId) {
      appState.set(dataType, detail.data);
      update();
    }
  });
});

function setAppStateClasses(appState, user) {
  const currentUser = user.get();
  let userRole = "user";

  document.body.classList.toggle("State-loggedIn", currentUser);
  document.body.classList.toggle("State-loggedOut", !currentUser);
  document.body.classList.toggle("State-booting", !appState.isLoaded());

  const userMenuComp = document.querySelector("user-menu");
  if (userMenuComp && currentUser) {
    userMenuComp.loggedin = true;
    userMenuComp.name = currentUser.first_name + " " + currentUser.last_name;
    userMenuComp.avatar = currentUser.avatar;
  }
  if (userMenuComp && !currentUser) {
    userMenuComp.loggedin = false;
    userMenuComp.name = false;
    userMenuComp.avatar = false;
  }

  if (appState.data.roles && currentUser) {
    const roles = appState.data.roles;
    if (roles.has && roles.has(currentUser.uid)) {
      userRole = "admin";
    }
  }
  document.body.classList.toggle("State-admin", userRole === "admin");
  document.body.classList.toggle(
    "State-hasTicket",
    currentUser && currentUser.hasTicket === true
  );

  document.body.classList.toggle(
    "State-qOffline",
    appState &&
      appState.data &&
      appState.data.q &&
      appState.data.q.active === false
  );
}

function update() {
  setAppStateClasses(appState, user);
}

function initUserMenu() {
  const userMenuComp = document.querySelector("user-menu");
  if (userMenuComp) {
    userMenuComp.addEventListener("logout", () => {
      document.body.classList.remove("State-showMenu");
      user.logOut();
    });
    userMenuComp.addEventListener("login", () => {
      document.body.classList.remove("State-showMenu");
      loginModal.open();
    });
    userMenuComp.addEventListener("register", () => {
      document.body.classList.remove("State-showMenu");
      registrationModal.open();
    });
  }
}

function init() {
  if (!initialized) {
    initialized = true;

    initUserMenu();

    if (typeof Turbolinks !== "undefined") {
      Turbolinks.start();
    }
  }
  update();
}

document.addEventListener("turbolinks:load", init);
