import { isEmpty } from "/js/Utils.mjs";

class State {
  constructor(subs = []) {
    this.data = {};
    this.loaded = false;
    this.onload = undefined;
    this.onupdate = undefined;
    this.requiredData = [];
    subs.forEach((sub) => {
      const key = sub.document ? sub.document : sub.collection;
      const cache = localStorage.getItem("data-" + key);
      if (cache && !isEmpty(cache)) {
        this.data[key] = JSON.parse(cache);
      } else {
        this.data[key] = false;
        this.requiredData.push(key);
      }
    });
  }
  isLoaded() {
    return this.requiredData.length === 0;
  }
  saveToCache(key, data) {
    if (data) {
      localStorage.setItem("data-" + key, JSON.stringify(data));
    }
  }
  set(dataType, data) {
    this.data[dataType] = data;
    this.requiredData = this.requiredData.filter((key) => key !== dataType);
    this.saveToCache(dataType, data);

    if (this.isLoaded() && !this.loaded) {
      this.loaded = true;
      if (this.onload) {
        this.onload(this);
      }
    }
  }
  get(dataType) {
    return this.data[dataType];
  }
}

export default State;
