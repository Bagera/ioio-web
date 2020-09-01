import { getUserTickets, isFunction, makeSubId } from "/js/Utils.mjs";

const subs = [
  { collection: "users", document: "" },
  { collection: "roles", document: "" },
  { collection: "tickets", document: "", filter: ["active", "==", true] },
];

class User {
  constructor({ auth, db, onupdate }) {
    this.auth = auth;
    this.auth = firebase.auth();
    this.db = db;
    this.user = false;
    this.onupdate = onupdate;
    this.state = {
      dbUser: false,
      tickets: false,
      users: false,
    };

    this.auth.onAuthStateChanged((user) => {
      this.setState("dbUser", user);
    });
    subs.forEach((sub) => {
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
  setState(dataType, data) {
    this.state[dataType] = data;
    this.setUser();
  }
  get() {
    return this.user;
  }
  create(email, password, userData, onError) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (dbUser) => {
        let newUserData = Object.assign({}, this.newAvatar(), userData);
        await this.db.set("users", dbUser.user.uid, newUserData);
        return dbUser;
      })
      .catch((error) => {
        console.log(error);
        if (isFunction(onError)) {
          onError(error);
        }
        return error;
      });
  }
  async update(userData) {
    this.db.update("users", this.user.uid, userData);
  }
  logIn(email, password, onSuccess, onError) {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then(function () {
        if (isFunction(onSuccess)) {
          onSuccess();
        }
      })
      .catch(function (error) {
        console.log(error);
        if (isFunction(onError)) {
          onError();
        }
      });
  }
  logOut(onSuccess, onError) {
    return this.auth
      .signOut()
      .then(function () {
        if (isFunction(onSuccess)) {
          onSuccess();
        }
      })
      .catch(function (error) {
        console.log(error);
        if (isFunction(onError)) {
          onError();
        }
      });
  }
  sendReset(email, onSuccess, onError) {
    return this.auth
      .sendPasswordResetEmail(email)
      .then(function () {
        if (isFunction(onSuccess)) {
          onSuccess();
        }
      })
      .catch(function (error) {
        console.log(error);
        if (isFunction(onError)) {
          onError();
        }
      });
  }
  emit() {
    const event = new CustomEvent(`userupdate`, {
      detail: {
        user: this.user,
      },
    });
    window.dispatchEvent(event);
  }
  newAvatar() {
    let avatarSeed = "";
    for (let i = 0; i < 10; i++) {
      avatarSeed += Math.floor(Math.random() * 10);
    }
    let avatar = `https://api.adorable.io/avatars/50/${avatarSeed}.png`;
    return { avatarSeed, avatar };
  }
  async setUser() {
    const oldUser = Object.assign({}, this.user);
    const { dbUser, roles, users, tickets } = this.state;
    if (dbUser && users) {
      const { uid } = dbUser;
      const activeTickets = tickets
        ? getUserTickets(uid, tickets).filter((t) => t.active)
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
      } else {
        this.emit();
      }
    }
  }
}

export default User;
