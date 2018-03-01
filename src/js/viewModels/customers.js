/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your customer ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojmodel',
  'ojs/ojcollectiontabledatasource', 'ojs/ojtable',
  'ojs/ojcollectionpagingdatasource',
  'ojs/ojdialog',
  'ojs/ojinputtext', 'ojs/ojlabel',
  'ojs/ojinputnumber',
  'ojs/ojpagingtabledatasource', 'ojs/ojpagingcontrol',
  'ojs/ojknockout', 'ojs/ojmodule', 'ojs/ojbutton'], function(oj, ko, $) {
  
    function CustomerViewModel() {
      let self = this;

      var User = oj.Model.extend({
        urlRoot: 'http://localhost:5000/api/users'
      });
      var Users = oj.Collection.extend({
        customURL: function(operation, collection, options) {
          if(!isNaN(options.fetchSize) && !isNaN(options.startIndex)) {
            return `http://localhost:5000/api/users?$limit=${options.fetchSize}&$skip=${options.startIndex}`;
          }

          return 'http://localhost:5000/api/users';
        },
        model: User,
        customPagingOptions: function(response) {
          if(!response || !response.data) {
            return response;
          }

          return {
            totalResults: response.total,
            limit: response.limit,
            count: response.data.length,
            offset: response.skip,
            hasMore: (response.skip + response.data.length) < response.total
          };
        }
      });

      this.createForm = {
        name: 'Anoop',
        age: 18,
        city: 'Bangalore'
      };

      this.saveUser = function() {
        self.users
          .create({
            name: self.createForm.name,
            age: self.createForm.age,
            city: self.createForm.city
          }, {
            wait: true
          });
      };

      this.users = new Users();

      this.users
        .fetch({
          startIndex: 0,
          fetchSize: 5
        })
        .then((data) => console.log(data))
        .catch((error) => console.log(error));

      this.columns = [
        {"headerText": "Name", "field": "name", "sortable": "enabled"},
        {"headerText": "Age", "field": "age", "sortable": "enabled"},
        {"headerText": "City", "field": "city", "sortable": "enabled"},
        {"headerText": "Actions", "sortable": "disabled"}
      ];

      this.datasource = new oj.CollectionTableDataSource(this.users);
      this.pagingDatasource = ko.observable();
      this.pagingDatasource(new oj.PagingTableDataSource(this.datasource));

      this.editDialog = {
        data: ko.observable(),
        open: function(data, event) {
          self.editDialog.data({
            id: data.id,
            name: data.name,
            age: data.age,
            city: data.city
          });
          document.getElementById("editDialog").open();  
        },
        close: function() {
          document.getElementById("editDialog").close();
        }
      }

      this.editUser = function() {
        let data = self.editDialog.data();
        self.users.get(data.id, {deferred: true}).then(function(model) {
          model.save(data, {wait:true});
        });
        self.editDialog.close();
      }

      this.deleteUser = function(data, event){
        self.users.get(data.id, {deferred: true}).then(function(model) {
          console.log(model);
          console.log(data.id);
          model.destroy({wait:true});
        });
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new CustomerViewModel();
  }
);

