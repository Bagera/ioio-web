import State from "/js/State.mjs";
import DB from "/js/DB.mjs";
import User from "/js/User.mjs";

import UserMenu from "/js/UserMenu.mjs";
import Q from "/js/q/Q.mjs";

const subs = [
  { collection: "settings", document: "q" },
  { collection: "users", document: "" },
  { collection: "roles", document: "" },
  { collection: "tickets", document: "" }
];

const db = new DB(firebase, firebaseConfig);

const appState = new State(subs);
appState.onload = function() {};
appState.onupdate = function(appState, newKey) {
  if (appState.isLoaded()) {
    update();
    if (newKey === "tickets") {
      user.update();
    }
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

const userMenu = new UserMenu();
const q = new Q();

function setAppStateClasses(appState, user) {
  const currentUser = user.get();
  document.body.classList.toggle("State-loggedIn", currentUser);
  document.body.classList.toggle("State-loggedOut", !currentUser);
  document.body.classList.toggle("State-booting", !appState.isLoaded());

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
  renderApps(appState, user, db);
}

function renderApps(appState, user, db) {}
