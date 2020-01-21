import DB from "/js/DB.mjs";
import User from "/js/User.mjs";
import Loans from "/js/lib/Loans.mjs";

class Lib {
  constructor({ subs }) {
    this.state = {};
    this.db = new DB(firebase, firebaseConfig);
    this.user = new User(firebase, {
      onupdate: this.onUserUpdate.bind(this)
    });
    subs.forEach(sub => {
      const dataType = sub.document ? sub.document : sub.collection;
      if (dataType === "loans") {
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
