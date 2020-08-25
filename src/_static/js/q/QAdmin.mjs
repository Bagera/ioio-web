import { makeSubId, mapToArray } from "/js/Utils.mjs";

class QAdmin {
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
    console.log(this.state);
    this.render();
  }

  render() {
    const qStats = document.querySelector("q-stats");
    const { tickets, users, q } = this.state;

    if (qStats) {
      if (tickets) {
        qStats.tickets = JSON.stringify(mapToArray(tickets));
      }
      if (q) {
        qStats.active = q.active;
      }
    }
  }
}

export default QAdmin;
