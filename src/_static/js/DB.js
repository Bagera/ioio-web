class DB {
  constructor(firebase, config) {
    firebase.initializeApp(config);
    this.db = firebase.firestore();
  }
  subscribe(collection, document, callback) {
    if (document) {
      this.db
        .collection(collection)
        .doc(document)
        .onSnapshot(function(doc) {
          callback(doc);
        });
    } else {
      this.db.collection(collection).onSnapshot(function(querySnapshot) {
        let data = [];
        querySnapshot.forEach(function(doc) {
          data.push(doc);
        });
        callback(data);
      });
    }
  }
  get(collection, document) {
    if (document) {
      this.db
        .collection(collection)
        .doc(document)
        .get()
        .then(function(doc) {
          return doc;
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
          return error;
        });
    } else {
      this.db
        .collection(collection)
        .get()
        .then(function(querySnapshot) {
          let data = [];
          querySnapshot.forEach(function(doc) {
            data.push(doc);
          });
          return data;
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
          return error;
        });
    }
  }
  set(collection, data, document) {
    if (document) {
      this.db
        .collection(collection)
        .doc(document)
        .set(data)
        .then(function() {})
        .catch(function(error) {
          return error;
        });
    } else {
      return this.add(collection, data);
    }
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
