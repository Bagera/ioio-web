const User = {
  provider: null,
  start: function(provider) {
    this.provider = provider;
  },
  logIn: function() {
    this.provider
      .auth()
      .setPersistence(this.provider.auth.Auth.Persistence.LOCAL)
      .then(function() {
        let provider = new this.provider.auth.GoogleAuthProvider();
        return this.provider.auth().signInWithRedirect(provider);
      })
      .catch(function(error) {
        let errorCode = error.code;
        let errorMessage = error.message;
      });
  },
  logOut: function() {
    this.provider
      .auth()
      .signOut()
      .then(
        function() {
          console.log("Sign-out successful");
        },
        function(error) {
          // An error happened.
        }
      );
  }
};
