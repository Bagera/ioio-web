import { makeSubId } from "/js/Utils.mjs";

function snapshotToMap(snapshot) {
  let data = new Map();
  snapshot.forEach(function(doc) {
    data.set(doc.id, doc.data());
  });
  return data;
}

class DB {
  constructor(firebase, config) {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    this.db = firebase.firestore();
    this.subs = {};
  }
  emit(subId) {
    const data = this.subs[subId];
    const event = new CustomEvent(`snapshot`, {
      detail: {
        subId,
        data
      }
    });
    window.dispatchEvent(event);
  }
  handleSnapshot(subId, data) {
    this.subs[subId] = data;
    this.emit(subId);
  }
  subscribe(collection, document, filter) {
    const subId = makeSubId([collection, document], filter);
    const handleSnapshot = this.handleSnapshot.bind(this);
    if (!this.subs[subId]) {
      if (document) {
        this.db
          .collection(collection)
          .doc(document)
          .onSnapshot(function(doc) {
            handleSnapshot(subId, doc.data());
          });
      } else if (filter) {
        this.db
          .collection(collection)
          .where(...filter)
          .onSnapshot(function(querySnapshot) {
            handleSnapshot(subId, snapshotToMap(querySnapshot));
          });
      } else {
        this.db.collection(collection).onSnapshot(function(querySnapshot) {
          handleSnapshot(subId, snapshotToMap(querySnapshot));
        });
      }
    } else {
      setTimeout(() => {
        this.emit(subId);
      }, 10);
    }
  }
  filteredSub(collection, filter, callback) {
    this.db
      .collection(collection)
      .where(...filter)
      .onSnapshot(function(querySnapshot) {
        callback(snapshotToMap(querySnapshot));
      });
  }
  get(collection, document) {
    if (document) {
      return this.db
        .collection(collection)
        .doc(document)
        .get()
        .catch(function(error) {
          console.log("Error getting document:", error);
          return error;
        });
    } else {
      return this.db
        .collection(collection)
        .get()
        .catch(function(error) {
          console.log("Error getting document:", error);
          return error;
        });
    }
  }
  set(collection, document, data, merge = false) {
    if (document) {
      const options = {
        merge
      };
      this.db
        .collection(collection)
        .doc(document)
        .set(data, options)
        .then(function() {})
        .catch(function(error) {
          return error;
        });
    } else {
      return this.add(collection, data);
    }
  }
  update(collection, document, data) {
    return this.set(collection, document, data, true);
  }
  add(collection, data) {
    this.db
      .collection(collection)
      .add(data)
      .then(function(docRef) {
        return docRef;
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
        return error;
      });
  }
}

export default DB;
