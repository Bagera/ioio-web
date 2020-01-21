import State from "/js/State.mjs";
import DB from "/js/DB.mjs";
import User from "/js/User.mjs";

import LoginModal from "/js/modal/LoginModal.mjs";
import RegistrationModal from "/js/modal/RegistrationModal.mjs";

const subs = [
  { collection: "settings", document: "q" },
  { collection: "users", document: "" },
  { collection: "roles", document: "" },
  { collection: "tickets", document: "" }
];

let view = false;
let initialized = false;
const db = new DB(firebase, firebaseConfig);

const appState = new State(subs);
appState.onload = function() {};
appState.onupdate = function(appState, newKey) {
  if (appState.isLoaded()) {
    update();
  }
};

const userConfig = {
  db: db,
  onupdate: function() {
    if (appState.isLoaded()) {
      update();
    }
  }
};
const user = new User(firebase, userConfig);
const loginModal = new LoginModal({ user });
const registrationModal = new RegistrationModal({ user });

subs.forEach(sub => {
  const dataType = sub.document ? sub.document : sub.collection;
  if (dataType === "tickets") {
    db.filteredSub(sub.collection, ["active", "==", true], function(
      snapshotData
    ) {
      appState.set(dataType, snapshotData);
      update();
    });
  } else {
    db.subscribe(sub.collection, sub.document, function(snapshotData) {
      appState.set(dataType, snapshotData);
      update();
    });
  }
});

function setAppStateClasses(appState, user) {
  const currentUser = user.get();
  document.body.classList.toggle("State-loggedIn", currentUser);
  document.body.classList.toggle("State-loggedOut", !currentUser);
  document.body.classList.toggle("State-booting", !appState.isLoaded());

  const userMenuComp = document.querySelector("user-menu");
  userMenuComp.loggedin = currentUser;

  document.body.classList.toggle(
    "State-admin",
    currentUser && currentUser.role && currentUser.role.admin
  );

  document.body.classList.toggle(
    "State-hasTicket",
    currentUser && currentUser.hasTicket === true
  );
}

function update() {
  setAppStateClasses(appState, user);
}

function init() {
  if (!initialized) {
    initialized = true;

    const userMenuComp = document.querySelector("user-menu");
    userMenuComp.addEventListener("logout", user.logOut);
    userMenuComp.addEventListener("login", loginModal.open);
    userMenuComp.addEventListener("register", registrationModal.open);

    if (typeof Turbolinks !== "undefined") {
      Turbolinks.start();
    }
  }
  update();
}

document.addEventListener("turbolinks:load", init);
window.addEventListener("load", init);
