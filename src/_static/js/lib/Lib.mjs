import { makeSubId } from "/js/Utils.mjs";

import User from "/js/User.mjs";
import Loans from "/js/lib/Loans.mjs";

class Lib {
  constructor({ db, subs }) {
    this.state = {};
    this.db = db;
    console.log("db", db);
    this.user = new User({
      auth: firebase.auth(),
      db: this.db,
      onupdate: this.onUserUpdate.bind(this)
    });
    subs.forEach(sub => {
      const dataType = sub.document ? sub.document : sub.collection;
      let subId = makeSubId([sub.collection, sub.document], sub.filter);

      this.db.subscribe(sub.collection, sub.document, sub.filter);
      window.addEventListener("snapshot", ({ detail }) => {
        if (detail.subId === subId) {
          this.setState(dataType, detail.data);
        }
      });
    });
  }

  handleClick(ev, currentUser, db) {
    let target = ev.target;
    if (target && target.classList.contains("LentItem-edit")) {
      const loan = target.parentNode.dataset.loan;
      console.log(loan);
      // if (currentUser && currentUser.admin) {
      //   db.update("tickets", ticketId, { active: false });
      // }
    }
  }

  onUserUpdate(user) {
    this.setState("user", user);
  }

  setState(dataType, snapshotData) {
    this.state[dataType] = snapshotData;
    this.render();
  }

  render() {
    const loansEl = document.querySelector(".Loans");
    const currentUser = this.state.user;
    const loans = this.state.loans;

    if (loansEl) {
      Loans(loansEl, loans, this.state.users, currentUser);
      loansEl.onclick = ev => {
        this.handleClick(ev, currentUser, this.db);
      };
    }
  }
}

export default Lib;
