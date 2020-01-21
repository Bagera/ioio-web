import DB from "/js/DB.mjs";
import { getUserTickets, isFunction } from "/js/Utils.mjs";

const subs = [
  { collection: "users", document: "" },
  { collection: "roles", document: "" },
  { collection: "tickets", document: "" }
];

class User {
  constructor(firebase, config) {
    this.auth = firebase.auth();
    this.db = new DB(firebase, firebaseConfig);
    this.user = false;
    this.onupdate = config.onupdate;
    this.state = {
      dbUser: false,
      tickets: false,
      users: false
    };

    this.auth.onAuthStateChanged(user => {
      this.setState("dbUser", user);
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
  setState = (dataType, data) => {
    this.state[dataType] = data;
    this.setUser();
  };
  get = () => {
    return this.user;
  };
  create = (email, password, userData, onError) => {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(async dbUser => {
        await this.db.set("users", dbUser.user.uid, userData);
        return dbUser;
      })
      .catch(error => {
        console.log(error);
        if (isFunction(onError)) {
          onError(error);
        }
        return error;
      });
  };
  logIn = (email, password, onSuccess, onError) => {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then(function() {
        if (isFunction(onSuccess)) {
          onSuccess();
        }
      })
      .catch(function(error) {
        console.log(error);
        if (isFunction(onError)) {
          onError();
        }
      });
  };
  logOut = (onSuccess, onError) => {
    return this.auth
      .signOut()
      .then(function() {
        if (isFunction(onSuccess)) {
          onSuccess();
        }
      })
      .catch(function(error) {
        console.log(error);
        if (isFunction(onError)) {
          onError();
        }
      });
  };
  sendReset = (email, onSuccess, onError) => {
    return this.auth
      .sendPasswordResetEmail(email)
      .then(function() {
        if (isFunction(onSuccess)) {
          onSuccess();
        }
      })
      .catch(function(error) {
        console.log(error);
        if (isFunction(onError)) {
          onError();
        }
      });
  };
  setUser = async () => {
    const oldUser = Object.assign({}, this.user);
    const { dbUser, roles, users, tickets } = this.state;
    if (dbUser && users) {
      const { uid } = dbUser;
      const activeTickets = tickets
        ? getUserTickets(uid, tickets).filter(t => t.active)
        : [];
      const user = Object.assign(
        { hasTicket: activeTickets.length > 0, uid },
        users.get(uid),
        roles ? roles.get(uid) : {}
      );
      this.user = user;
    } else {
      this.user = false;
    }
    if (JSON.stringify(oldUser) != JSON.stringify(this.user)) {
      if (this.onupdate) {
        this.onupdate(this.user);
      }
    }
  };
}

export default User;
