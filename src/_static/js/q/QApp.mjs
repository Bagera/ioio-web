import { makeSubId, sortBy } from "/js/Utils.mjs";

import User from "/js/User.mjs";
import TicketRoll from "/js/q/TicketRoll.mjs";
import CurrentTicket from "/js/q/CurrentTicket.mjs";
import TicketQueue from "/js/q/TicketQueue.mjs";

class QApp {
  constructor({ db, subs = [] }) {
    this.state = {};
    this.db = db;
    this.user = new User({
      auth: firebase.auth(),
      db: this.db,
      onupdate: this.onUserUpdate.bind(this),
    });
    this.subIds = {};
    subs.forEach((sub) => {
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

    const currentTicketEl = document.querySelector(".CurrentTicket");
    const queueEl = document.querySelector(".TicketQueue");

    if (currentTicketEl) {
      currentTicketEl.addEventListener("click", (ev) => {
        this.handleTicketClick(ev);
      });
    }
    if (queueEl) {
      queueEl.addEventListener("click", (ev) => {
        this.handleTicketClick(ev);
      });
    }
  }

  onUserUpdate(user) {
    this.setState("user", user);
  }

  setState(dataType, snapshotData) {
    this.state[dataType] = snapshotData;
    this.render();
  }

  resolveTicket(ticketEl, currentUser, db) {
    // TODO Resolve should do more
    const { ticketid, uid } = ticketEl.dataset;
    if (currentUser && currentUser.admin) {
      db.update("tickets", ticketid, { active: false });
    }
  }

  cancelTicket(ticketEl, currentUser, db) {
    const { ticketid, uid } = ticketEl.dataset;
    if (currentUser && (currentUser.admin || currentUser.id === uid)) {
      db.update("tickets", ticketid, { active: false });
    }
  }

  handleTicketClick(ev) {
    let target = ev.target;
    console.log("click");
    if (target) {
      const currentUser = this.state.user;
      const db = this.db;
      if (target.classList.contains("QueueTicket-resolve")) {
        this.resolveTicket(target.parentNode, currentUser, db);
      }
      if (
        target.classList.contains("CurrentTicket-cancel") ||
        target.classList.contains("QueueTicket-cancel")
      ) {
        this.cancelTicket(target.parentNode, currentUser, db);
      }
    }
  }

  sortTicketStore(tickets) {
    let filteredTickets = [];

    if (tickets) {
      tickets.forEach((ticket, id) => {
        ticket.id = id;
        filteredTickets.push(ticket);
      });
      if (filteredTickets.length > 0) {
        filteredTickets = sortBy(filteredTickets, "timestamp");
      }
    }

    return filteredTickets;
  }

  render() {
    const currentTicketEl = document.querySelector(".CurrentTicket");
    const queueEl = document.querySelector(".TicketQueue");
    const rollEl = document.querySelector(".TicketRoll");
    const currentUser = this.state.user;
    const queue = this.state.tickets
      ? this.sortTicketStore(this.state.tickets)
      : undefined;

    if (currentTicketEl) {
      CurrentTicket(currentTicketEl, currentUser, queue);
    }
    if (queueEl) {
      TicketQueue(queueEl, queue, this.state.users, currentUser);
    }
    if (rollEl) {
      TicketRoll(rollEl, queue, this.user, this.db);
    }
  }
}

export default QApp;
