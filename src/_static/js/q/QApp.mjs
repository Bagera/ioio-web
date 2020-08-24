import { makeSubId } from "/js/Utils.mjs";

import User from "/js/User.mjs";
import TicketQueue from "/js/q/TicketQueue.mjs";
import TicketRoll from "/js/q/TicketRoll.mjs";

class QApp {
  constructor({ db, subs = [] }) {
    this.state = {};
    this.db = db;
    this.user = new User({
      auth: firebase.auth(),
      db: this.db,
      onupdate: this.onUserUpdate.bind(this)
    });
    this.subIds = {};
    subs.forEach(sub => {
      const dataType = sub.document ? sub.document : sub.collection;
      let subId = makeSubId([sub.collection, sub.document], sub.filter);
      this.subIds[subId] = dataType;

      this.db.subscribe(sub.collection, sub.document, sub.filter);

      window.addEventListener("snapshot", ({ detail }) => {
        if (detail.subId === subId) {
          this.setState(this.subIds[subId], detail.data);
        }
      });
    });
  }

  onUserUpdate(user) {
    this.setState("user", user);
  }

  setState(dataType, snapshotData) {
    this.state[dataType] = snapshotData;
    this.render();
  }

  resolveTicket(ticketId, currentUser, db) {
    if (currentUser && currentUser.admin) {
      db.update("tickets", ticketId, { active: false });
    }
  }

  handleTicketClick(ev, currentUser, db) {
    let target = ev.target;
    if (target) {
      if (target.classList.contains("QueueTicket-resolve")) {
        this.resolveTicket(target.parentNode.dataset.ticket, currentUser, db);
      }
    }
  }

  render() {
    const queueEl = document.querySelector(".TicketQueue");
    const rollEl = document.querySelector(".TicketRoll");
    const currentUser = this.state.user;
    const tickets = this.state.tickets;

    if (queueEl) {
      TicketQueue(queueEl, tickets, this.state.users, currentUser);
      queueEl.addEventListener("click", ev => {
        this.handleTicketClick(ev, currentUser, this.db);
      });
    }
    if (rollEl) {
      TicketRoll(rollEl, tickets, this.user, this.db);
    }
  }
}

export default QApp;