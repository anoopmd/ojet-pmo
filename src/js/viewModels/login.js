/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'helpers/message-bus',
        'helpers/current-user',
        'ojs/ojrouter',
        'ojs/ojknockout',
        'ojs/ojcheckboxset',
        'ojs/ojinputtext',
        'ojs/ojbutton',
        'ojs/ojanimation'], function(oj, ko, $, MessageBus, CurrentUser) {
  function signinViewModel() {
    var self = this;

    // Replace with state save logic for rememberUserName
    self.userName = ko.observable('Harry Carson');
    self.passWord = ko.observable('password');

    // Replace with sign in authentication
    self.signIn = function() {
      CurrentUser.set({
        username: self.userName(),
        token: 'secret'
      });
      MessageBus.trigger("user:loggedIn", {
        username: self.userName(),
        token: 'secret'
      });
    };

  }
  return signinViewModel;
});