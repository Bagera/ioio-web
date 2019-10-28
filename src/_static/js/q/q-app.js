import State from "/js/State.js";
import DB from "/js/DB.js";
import Queue from "/js/Queue.js";
import User from "/js/User.js";
import Modal from "/js/Modal.js";

const subs = [
  { collection: "q", document: "settings" },
  { collection: "users", document: "" },
  { collection: "roles", document: "" },
  { collection: "tickets", document: "" }
];

const queueConfig = {
  listSelector: ".TicketQueue",
  ticketSelector: ".TicketRoll-number",
  onclick: ticketId => {
    console.log(ticketId);
    db.set("tickets", { handled: true }, ticketId, true);
  }
};
const loginConfig = {
  containerSelector: ".Modal-container",
  template: `
    <form class="Modal-form Modal-login">
      <div class="Modal-formBody">
        <label>Email
          <input name="email" type="email" required>
        <label>
        </label>Password
          <input name="password" type="password" required>
        </label>
        <button type="button" class="Modal-button Modal-resetEmail">Forgot your password?</button>
      </div>
      <button class="Modal-button">Log in</button>
    </form>
  `,
  onopen: () => {
    document.querySelector(".Modal-resetEmail").onclick = () => {
      resetModal.open();
    };
  },
  onsubmit: function(formData) {
    document.body.classList.add("State-loggingIn");
    user.logIn(formData.email, formData.password, function() {
      loginModal.close();
    });
  }
};
const resetConfig = {
  containerSelector: ".Modal-container",
  template: `
    <form class="Modal-form Modal-reset">
      <div class="Modal-formBody">
        <label>Email
          <input name="email" type="email" required>
        <label>
      </div>
      <button class="Modal-button">Send reset link</button>
    </form>
  `,
  onsubmit: function(formData) {
    user.sendReset(formData.email, function() {});
  }
};
const registrationConfig = {
  containerSelector: ".Modal-container",
  template: `
    <form class="Modal-form Modal-registration">
      <div class="Modal-formBody">
        <label>Email
          <input name="email" type="email" required>
        <label>
        <label>Password
          <input name="password" type="password" required>
        <label>
        <label>First name
          <input name="first_name" type="text" required>
        <label>
        <label>Last name
          <input name="last_name" type="text" required>
        <label>
        <label>Programme
          <input name="studies" type="text" required>
        <label>
        
      </div>
      <button class="Modal-button">Register</button>
    </form>
  `,
  onsubmit: function(formData) {
    const { email, password, first_name, last_name, studies } = formData;
    const newUser = {
      first_name,
      last_name,
      studies
    };
    user.create(email, password, error => {
      if (error) {
      } else {
        db.set("users", newUser, user.get().uid);
      }
    });
  }
};
const ticketModalConfig = {
  containerSelector: ".Modal-container",
  template: `
  <form class="Modal-form Modal-ticket" type="post">
    <div class="Modal-formBody">
      <label>
        Room
        <select name="location" class="Modal-ticketInput">
          <option value="">Pick your location in the workshop</option>
        </select>
      </label>
      <fieldset>
        <legend>How long is your issue</legend>
        <label>
          5 min
          <input type="radio" name="est" value="5" checked="true" />
        </label>
        <label>
          10 min
          <input type="radio" name="est" value="10" />
        </label>
      </fieldset>
    </div>
    <button class="Modal-button Modal-ticketSubmit">Add ticket</button>
  </form>
  `,
  onopen: () => {
    let select = document.querySelector(".Modal-ticket select");
    const options = qState
      .get("settings")
      .locations.map(room => `<option>${room}</option>`);
    select.innerHTML = options.join("\n");
  },
  onsubmit: formData => {
    formData.timestamp = firebase.firestore.Timestamp.now().toMillis();
    formData.uid = user.get().uid;
    formData.handled = false;

    if (formData.uid) {
      db.set("tickets", formData);
    }
  }
};
const userConfig = {
  onupdate: function(userObj) {
    if (qState.isLoaded()) {
      setCurrentUser(user.get());
    }
  }
};

const qState = new State(subs);
const db = new DB(firebase, firebaseConfig);
const queue = new Queue(queueConfig);
const user = new User(firebase, userConfig);
const registrationModal = new Modal(registrationConfig);
const loginModal = new Modal(loginConfig);
const ticketModal = new Modal(ticketModalConfig);
const resetModal = new Modal(resetConfig);
let currentUser = false;

user.subscribe();

document.body.classList.add("State-booting");
document.querySelector(".Navbar-registration").onclick = function(ev) {
  registrationModal.open();
};
document.querySelector(".Navbar-login").onclick = function(ev) {
  loginModal.open();
};
document.querySelector(".Navbar-logout").onclick = function(ev) {
  user.logOut();
};

qState.onload = function() {
  setCurrentUser(user.get());
};
qState.onupdate = function(appState) {
  if (appState.isLoaded()) {
    queue.render(appState.get("tickets"), appState.get("users"), currentUser);
  }
};

subs.forEach(sub => {
  const dataType = sub.document ? sub.document : sub.collection;
  db.subscribe(sub.collection, sub.document, function(snapshotData) {
    let data;
    if (snapshotData.data) {
      data = snapshotData.data();
    } else {
      data = {};
      snapshotData.forEach(doc => {
        data[doc.id] = doc.data();
      });
    }
    qState.set(dataType, data);
    setAppStateClasses(qState, currentUser, queue);
  });
});

let touchStart = 0;
let touchId = 0;

function handleTicketTouchStart(touch) {
  touchId = touch.identifier;
  touchStart = touch.pageY;
}
function handleTicketTouchMove(touch, target) {
  const ticket = target.parentNode;
  const spacer = ticket.querySelector(".TicketRoll-spacer");
  const dist = touch.pageY - touchStart;
  if (dist > 0 && dist < 120) {
    spacer.style.height = `${dist}px`;
    ticket.classList.add("TicketRoll-pulling");
  } else if (dist >= 120) {
    handleTicketTouchEnd(target);
    ticketModal.open();
  }
}
function handleTicketTouchEnd(target) {
  const ticket = target.parentNode;
  const spacer = ticket.querySelector(".TicketRoll-spacer");
  ticket.classList.remove("TicketRoll-pulling");
  spacer.style.height = "0px";
}

document.querySelector(".TicketRoll-button").onclick = function() {
  ticketModal.open();
};
document.querySelector(".TicketRoll-button").ontouchstart = function(ev) {
  handleTicketTouchStart(ev.touches[0]);
};
document.querySelector(".TicketRoll-button").ontouchend = function() {
  handleTicketTouchEnd(this);
};
document.querySelector(".TicketRoll-button").ontouchmove = function(ev) {
  let touch;
  for (let i = 0; i < ev.touches.length; i++) {
    const evTouch = ev.touches[i];
    if (evTouch.identifier === touchId) {
      touch = evTouch;
    }
  }
  if (touch) {
    handleTicketTouchMove(touch, this);
  } else {
    handleTicketTouchEnd(this);
  }
};

function userTickets(currentUser, tickets = []) {
  return tickets.filter(t => t.uid === currentUser.uid);
}

function setAppStateClasses(appState, currentUser, queue) {
  document.body.classList.toggle("State-loggedIn", currentUser);
  document.body.classList.toggle("State-loggedOut", !currentUser);
  document.body.classList.toggle("State-booting", !appState.isLoaded());

  if (currentUser) {
    document.body.classList.toggle(
      "State-admin",
      currentUser.role && currentUser.role.admin
    );

    const tickets = queue.sortTicketStore(appState.get("tickets"));
    const hasTicket = userTickets(currentUser, tickets).length > 0;
    document.body.classList.toggle("State-hasTicket", hasTicket);
  }
}

function setCurrentUser(userObj) {
  let userData = false;
  if (userObj && userObj.uid) {
    if (qState.get("users") && qState.get("roles")) {
      userData = {
        uid: userObj.uid,
        user: qState.get("users")[userObj.uid],
        role: qState.get("roles")[userObj.uid]
      };
    }
  }
  document.body.classList.remove("State-loggingIn");
  currentUser = userData;
  setAppStateClasses(qState, currentUser, queue);
}
