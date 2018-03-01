/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'knockout', 'helpers/message-bus', 
  'helpers/current-user',
  'ojs/ojrouter', 'ojs/ojknockout', 'ojs/ojarraytabledatasource'],
  function(oj, ko, MessageBus, CurrentUser) {
     function ControllerViewModel() {
       var self = this;

      // Media queries for repsonsive layouts
      var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

       // Router setup
       self.router = oj.Router.rootInstance;
       self.router.configure({
         'login': {label: 'Sign In'},
         'dashboard': {label: 'Dashboard', isDefault: true},
         'incidents': {label: 'Incidents'},
         'customers': {label: 'Customers'},
         'about': {label: 'About'}
       });
      oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

      // Navigation setup
      var navData = [
      {name: 'Dashboard', id: 'dashboard',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'},
      {name: 'Incidents', id: 'incidents',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24'},
      {name: 'Customers', id: 'customers',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24'},
      {name: 'About', id: 'about',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24'}
      ];
      self.navDataSource = new oj.ArrayTableDataSource(navData, {idAttribute: 'id'});
      self.isLoggedIn = ko.observable(false);

      // Header
      // Application Name used in Branding Area
      self.appName = ko.observable("PMO App");
      // User Info used in Global Navigation area
      self.userLogin = ko.observable();

      let currentUser = CurrentUser.get();

      if(currentUser && currentUser.token) {
        self.isLoggedIn(true);
        self.userLogin(currentUser.username);
        oj.Router.rootInstance.go('dashboard');
      } else {
        oj.Router.rootInstance.go('login');
      }

      MessageBus.on("user:loggedIn", function(data) {
        self.isLoggedIn(true);
        self.userLogin(data.username);
        oj.Router.rootInstance.go('dashboard');
      });

      self.menuChanged = function(data) {
        if(data.target.id === "out") {
          CurrentUser.set(null);
          self.isLoggedIn(false);
          oj.Router.rootInstance.go('login');
        }
      };
      // Footer
      function footerLink(name, id, linkTarget) {
        this.name = name;
        this.linkId = id;
        this.linkTarget = linkTarget;
      }
      self.footerLinks = ko.observableArray([
        new footerLink('About Oracle', 'aboutOracle', 'http://www.oracle.com/us/corporate/index.html#menu-about'),
        new footerLink('Contact Us', 'contactUs', 'http://www.oracle.com/us/corporate/contact/index.html'),
        new footerLink('Legal Notices', 'legalNotices', 'http://www.oracle.com/us/legal/index.html'),
        new footerLink('Terms Of Use', 'termsOfUse', 'http://www.oracle.com/us/legal/terms/index.html'),
        new footerLink('Your Privacy Rights', 'yourPrivacyRights', 'http://www.oracle.com/us/legal/privacy/index.html')
      ]);
     }

     return new ControllerViewModel();
  }
);
