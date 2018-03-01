define(['helpers/cache'], function(Cache){
  function CurrentUser() {
    this.get = function() {
      return Cache.getJSON('_currentUser');
    }

    this.set = function(user) {
      return Cache.setJSON('_currentUser', user);
    }
  }

  return new CurrentUser();
});