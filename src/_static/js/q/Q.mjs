import DB from "/js/DB.mjs";
import User from "/js/User.mjs";
import TicketQueue from "/js/q/TicketQueue.mjs";
import TicketRoll from "/js/q/TicketRoll.mjs";

const subs = [
  { collection: "settings", document: "q" },
  { collection: "users", document: "" },
  { collection: "tickets", document: "" }
];

class Q {
  constructor() {
    this.state = {};
    this.db = new DB(firebase, firebaseConfig);
    this.user = new User(firebase, {
      onupdate: this.onUserUpdate.bind(this)
    });
    subs.forEach(sub => {
      const dataType = sub.document ? sub.document : sub.collection;
      if (dataType === "tickets") {
        this.db.filteredSub(
          sub.collection,
          ["active", "==", true],
          snapshotData => {
            this.setState(dataType, snapshotData);
          }
        );
      } else {
        this.db.subscribe(sub.collection, sub.document, snapshotData => {
          this.setState(dataType, snapshotData);
        });
      }
    });
  }

  onUserUpdate(user) {
    this.setState("user", user);
  }

  setState(dataType, snapshotData) {
    this.state[dataType] = snapshotData;
    this.render();
  }

  handleTicketResolve(ev, currentUser, db) {
    let target = ev.target;
    if (target && target.classList.contains("QueueTicket-resolve")) {
      const ticketId = target.parentNode.dataset.ticket;
      if (currentUser && currentUser.admin) {
        db.update("tickets", ticketId, { active: false });
      }
    }
  }

  render() {
    const queueEl = document.querySelector(".TicketQueue");
    const rollEl = document.querySelector(".TicketRoll");
    const currentUser = this.state.user;
    const tickets = this.state.tickets;
    const settings = this.state.q;

    if (queueEl) {
      TicketQueue(queueEl, tickets, this.state.users, currentUser);
      queueEl.onclick = ev => {
        this.handleTicketResolve(ev, currentUser, this.db);
      };
    }
    if (rollEl) {
      TicketRoll(rollEl, tickets, this.user, this.db);
    }
  }
}

export default Q;
