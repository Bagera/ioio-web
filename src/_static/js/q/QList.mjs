import { makeSubId, sortTicketStore } from "/js/Utils.mjs";

import TicketQueue from "/js/q/TicketQueue.mjs";

class QList {
  constructor({ db, subs = [] }) {
    this.state = {};
    this.db = db;
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
  }

  setState(dataType, snapshotData) {
    this.state[dataType] = snapshotData;
    this.render();
  }

  render() {
    const queueEl = document.querySelector(".TicketQueue");
    const queue = this.state.tickets
      ? sortTicketStore(this.state.tickets)
      : undefined;

    if (queueEl) {
      TicketQueue(queueEl, queue, this.state.users);
    }
  }
}

export default QList;
