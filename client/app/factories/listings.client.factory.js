angular.module('listings').factory('Listings', ['$http', 
  function($http) {
    var portNumber = '8080';
    var methods = {
      getAll: function() {
        return $http.get('http://localhost:' + portNumber + '/api/listings');
      },

      create: function(listing) {
        return $http.post('http://localhost:' + portNumber + '/api/listings', listing);
      }, 

      read: function(id) {
        return $http.get('http://localhost:' + portNumber + '/api/listings/' + id);
      }, 

      update: function(id, listing) {
        return $http.put('http://localhost:' + portNumber + '/api/listings/' + id, listing);
      }, 

      delete: function(id) {
        return $http.delete('http://localhost:' + portNumber + '/api/listings/' + id);
      }
    };

    return methods;
  }
]);