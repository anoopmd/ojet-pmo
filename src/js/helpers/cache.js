define([], function(){
  function Cache() {
    this.get = function(key) {
      return window.localStorage.getItem(key);
    }

    this.set = function(key, value) {
      return window.localStorage.setItem(key, value);
    }

    this.getJSON = function(key) {
      let val = window.localStorage.getItem(key);

      return JSON.parse(val);
    }

    this.setJSON = function(key, value) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }

  return new Cache();
});