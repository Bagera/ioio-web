const lendingDocument = "loans";
const firebaseConfig = {
  apiKey: "AIzaSyD6khnayxet1ExZAzmvLr5x29ZiStxopIU",
  authDomain: "ioiolendingsystem.firebaseapp.com",
  databaseURL: "https://ioiolendingsystem.firebaseio.com",
  projectId: "ioiolendingsystem",
  storageBucket: "ioiolendingsystem.appspot.com",
  messagingSenderId: "89677931964",
  appId: "1:89677931964:web:cab3a91593f248624a77b9"
};
let currentUser;
let loadedUser = false;
let db;
let cachedSnapshot = [];

function sortBy(array, property, reverse) {
  let sorted = [...array];
  sorted.sort((a, b) => {
    const type = typeof a[property];
    if (type === "string") {
      return a[property].localeCompare(b[property]);
    } else if (type === "number") {
      return a[property] - b[property];
    } else {
      return 0;
    }
  });
  if (reverse) {
    sorted.reverse();
  }
  return sorted;
}

function initFirebase() {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();

  db.collection(lendingDocument).onSnapshot(function(querySnapshot) {
    cachedSnapshot = querySnapshot;
    Table.render(querySnapshot);
    setLoadedState();
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (!loadedUser) {
      loadedUser = true;
    }
    updateUser(user);
  });

  document
    .querySelector(".navbar_log-in")
    .addEventListener("click", function(e) {
      e.preventDefault();
      logIn();
    });

  document
    .querySelector(".navbar_log-out")
    .addEventListener("click", function(e) {
      e.preventDefault();
      logOut();
    });
}

/**
 * Log into Firebase with google
 *
 */
function logIn() {
  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function() {
      let provider = new firebase.auth.GoogleAuthProvider();
      return firebase.auth().signInWithRedirect(provider);
    })
    .catch(function(error) {
      let errorCode = error.code;
      let errorMessage = error.message;
    });
}

/**
 * Log out of Firebase
 *
 */
function logOut() {
  firebase
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

/**
 * Check if user is Admin and update the UI
 *
 * @param {*} user
 */

function updateUser(user) {
  if (user) {
    //Check if user's Google account is registered as an admin account in the database
    db.collection("lenders")
      .doc(user.uid)
      .get()
      .then(admin => {
        if (admin.exists) {
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
        Table.render(cachedSnapshot);
        setLoadedState();
      });
  } else {
    setCurrentUser(null);
    Table.render(cachedSnapshot);
    setLoadedState();
  }
}

function getInitials(string) {
  const letters = string.split(" ").map(word => word.charAt(0));
  return letters.join("");
}

/**
 * Check if all things have been loaded once
 *
 */
function setLoadedState() {
  if (cachedSnapshot && loadedUser) {
    document.body.classList.remove("State-loading");
    document.body.classList.add("State-loaded");
  } else {
    document.body.classList.add("State-loading");
    document.body.classList.remove("State-loaded");
  }
}

/**
 * Pad string to the left
 *
 * @param {*} string
 * @param {number} [length=2]
 * @param {string} [character="0"]
 * @returns
 */
function padLeft(string, length = 2, character = "0") {
  let returnString = string.toString();
  while (returnString.length < length) {
    returnString = character + returnString;
  }
  return returnString;
}

/**
 * Get a formatted date, Defaults to today.
 *
 * @param {Date} [date=new Date()]
 * @returns {string} formatted date YYYY-MM-DD
 */
function getFormattedDate(date = new Date()) {
  return (
    date.getFullYear() +
    "-" +
    padLeft(date.getMonth() + 1) +
    "-" +
    padLeft(date.getDate())
  );
}

function handleBorrow(event) {
  event.preventDefault();
  const payload = {
    name: event.target.name.value,
    object: event.target.object.value,
    amount: event.target.amount.value,
    loanDate: Date.now(),
    returnDate: "",
    responsible: getInitials(currentUser.displayName)
  };
  db.collection(lendingDocument)
    .add(payload)
    .then(event.target.reset());
}

function handleReturn(docId, event) {
  event.preventDefault();

  const payload = {
    returnDate: Date.now()
  };

  db.collection(lendingDocument)
    .doc(docId)
    .update(payload)
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      console.error("Error updateing document: ", error);
    });
}

function setCurrentUser(user) {
  const headerStatus = document.querySelector(".navbar-status");
  currentUser = user;
  if (user) {
    document.body.classList.add("logged-in");
    headerStatus.innerHTML = user.displayName;
    Form.setState(true);
  } else {
    document.body.classList.remove("logged-in");
    headerStatus.innerHTML = "Not logged in";
    Form.setState(false);
  }
}

window.onload = () => {
  setLoadedState();
  initFirebase();
  Form.start(".borrow-form");
  Table.start(".loans");
};
