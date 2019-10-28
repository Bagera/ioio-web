class State {
  constructor(subs = []) {
    this.data = {
      qSettings: {},
      roles: {},
      tickets: [],
      users: {}
    };
    this.loaded = false;
    this.onload = undefined;
    this.onupdate = undefined;
    this.requiredData = [];
    subs.forEach(sub => {
      const dataType = sub.document ? sub.document : sub.collection;
      this.requiredData.push(dataType);
    });
  }
  isLoaded = function() {
    return this.requiredData.length === 0;
  };
  set = function(dataType, data) {
    this.data[dataType] = data;
    this.requiredData = this.requiredData.filter(key => key !== dataType);
    if (this.onupdate) {
      this.onupdate(this);
    }
    if (this.isLoaded() && !this.loaded) {
      this.loaded = true;
      if (this.onload) {
        this.onload(this);
      }
    }
  };
  get = function(dataType) {
    return this.data[dataType];
  };
}

export default State;
