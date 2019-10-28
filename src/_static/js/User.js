class User {
  constructor(firebase, config) {
    this.auth = firebase.auth();
    this.user = {};
    this.onupdate = config.onupdate;
  }
  handleAuthStateChanged(user) {
    this.setUser(user);
    if (this.onupdate) {
      this.onupdate(this.user);
    }
  }
  get() {
    return this.user;
  }
  create(email, password) {
    this.auth
      .createUserWithEmailAndPassword(email, password)
      .catch(function(error) {
        console.log(error);
        return error;
      });
  }
  logIn(email, password, onSuccess, onError) {
    this.auth
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
    this.auth
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
    this.auth
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
  setUser(user) {
    if (user) {
      const { uid, email } = user;
      this.user = {
        uid,
        email
      };
    } else {
      this.user = false;
    }
  }
  subscribe() {
    this.auth.onAuthStateChanged(user => {
      this.handleAuthStateChanged(user);
    });
  }
}

export default User;
