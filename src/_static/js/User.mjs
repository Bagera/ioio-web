import DB from "/js/DB.mjs";
import { getUserTickets } from "/js/Utils.mjs";

class User {
  constructor(firebase, config) {
    this.auth = firebase.auth();
    this.db = new DB(firebase, firebaseConfig);
    this.user = false;
    this.onupdate = config.onupdate;

    this.auth.onAuthStateChanged(user => {
      this.setUser(user);
    });
  }
  get() {
    return this.user;
  }
  create(email, password, userData, onError) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(async dbUser => {
        await this.db.set("users", dbUser.user.uid, userData);
        return dbUser;
      })
      .catch(error => {
        console.log(error);
        if (onError) {
          onError(error);
        }
        return error;
      });
  }
  logIn(email, password, onSuccess, onError) {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then(function() {
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch(function(error) {
        console.log(error);
        if (onError) {
          onError();
        }
      });
  }
  logOut(onSuccess, onError) {
    return this.auth
      .signOut()
      .then(function() {
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch(function(error) {
        console.log(error);
        if (onError) {
          onError();
        }
      });
  }
  sendReset(email, onSuccess, onError) {
    return this.auth
      .sendPasswordResetEmail(email)
      .then(function() {
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch(function(error) {
        console.log(error);
        if (onError) {
          onError();
        }
      });
  }
  update() {
    return this.setUser(this.user);
  }
  async setUser(authUser) {
    if (authUser) {
      const { uid } = authUser;
      let usersPromise = this.db.get("users", uid);
      let rolesPromise = this.db.get("roles", uid);
      let ticketPromise = this.db.get("tickets");

      await Promise.all([usersPromise, rolesPromise, ticketPromise]).then(
        values => {
          const [userData, role, tickets] = values;
          const activeTickets = getUserTickets(uid, tickets).filter(
            t => t.active
          );
          const user = Object.assign(
            { hasTicket: activeTickets.length > 0, uid },
            userData.data(),
            role.data()
          );

          this.user = user;
        }
      );
    } else {
      this.user = false;
    }
    if (this.onupdate) {
      this.onupdate(this.user);
    }
  }
}

export default User;
