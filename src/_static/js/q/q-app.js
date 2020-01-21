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
    if (currentUser && currentUser.role && currentUser.role.admin) {
      db.update("tickets", ticketId, { handled: true });
    }
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
    resetModal.close();
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
  onopen: async () => {
    let select = document.querySelector(".Modal-ticket select");
    const options = await db.get("q", "settings");
    // .data()
    // .locations.map(room => `<option>${room}</option>`);
    console.log(options);
    // select.innerHTML = options.join("\n");
  },
  onsubmit: formData => {
    formData.timestamp = firebase.firestore.Timestamp.now().toMillis();
    formData.uid = user.get().uid;
    formData.active = true;

    if (formData.uid) {
      db.add("tickets", formData);
    }
  }
};
const userConfig = {
  onupdate: function(userObj) {
    if (appState.isLoaded()) {
      setCurrentUser(user.get());
    }
  }
};

const queue = new Queue(queueConfig);
// const user = new User(firebase, userConfig);
const registrationModal = new Modal(registrationConfig);
const loginModal = new Modal(loginConfig);
const ticketModal = new Modal(ticketModalConfig);
const resetModal = new Modal(resetConfig);
let currentUser = false;

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
    ticketModal.open({ x: "0", y: "-" + dist + "px" });
  }
}
function handleTicketTouchEnd(target) {
  const ticket = target.parentNode;
  const spacer = ticket.querySelector(".TicketRoll-spacer");
  ticket.classList.remove("TicketRoll-pulling");
  spacer.style.height = "0px";
}

document.querySelector(".TicketRoll-button").onclick = function() {
  ticketModal.open({ x: "0", y: "-40vh" });
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
