import { isEmpty } from "/js/Utils.mjs";

class State {
  constructor(subs = []) {
    this.data = {};
    this.loaded = false;
    this.onload = undefined;
    this.onupdate = undefined;
    this.requiredData = [];
    subs.forEach(sub => {
      const key = sub.document ? sub.document : sub.collection;
      const cache = JSON.parse(localStorage.getItem("data-" + key));
      if (cache && !isEmpty(cache)) {
        this.data[key] = cache;
      } else {
        this.data[key] = false;
        this.requiredData.push(key);
      }
    });
  }
  isLoaded = function() {
    return this.requiredData.length === 0;
  };
  saveToCache = function(key, data) {
    localStorage.setItem("data-" + key, JSON.stringify(data));
  };
  set = function(dataType, data) {
    this.data[dataType] = data;
    this.requiredData = this.requiredData.filter(key => key !== dataType);
    this.saveToCache(dataType, data);
    if (this.onupdate) {
      this.onupdate(this, dataType);
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
