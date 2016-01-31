angular.module('listings').controller('ListingsController', ['$scope', '$location', '$stateParams', '$state', 'Listings', 
  function($scope, $location, $stateParams, $state, Listings){
    $scope.find = function() {
      /* set loader*/
      $scope.loading = true;

      /* Get all the listings, then bind it to the scope */
      Listings.getAll().then(function(response) {
        $scope.loading = false; //remove loader
        $scope.listings = response.data;
      }, function(error) {
        $scope.loading = false;
        $scope.error = 'Unable to retrieve listings!\n' + error;
      });
    };

    $scope.findOne = function() {
     // debugger;
      $scope.loading = true;

      /*
        Take a look at 'list-listings.client.view', and find the ui-sref attribute that switches the state to the view 
        for a single listing. Take note of how the state is switched: 
          ui-sref="listings.view({ listingId: listing._id })"
        Passing in a parameter to the state allows us to access specific properties in the controller.
        Now take a look at 'view-listing.client.view'. The view is initialized by calling "findOne()". 
        $stateParams holds all the parameters passed to the state, so we are able to access the id for the 
        specific listing we want to find in order to display it to the user. 
       */

      var id = $stateParams.listingId;

      Listings.read(id)
              .then(function(response) {
                $scope.listing = response.data;
                $scope.loading = false;
              }, function(error) {  
                $scope.error = 'Unable to retrieve listing with id "' + id + '"\n' + error;
                $scope.loading = false;
              });
    };  

    $scope.create = function(isValid) {
      $scope.error = null;

      /* 
        Check that the form is valid. (https://github.com/paulyoder/angular-bootstrap-show-errors)
       */
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      /* Create the listing object */
      var listing = {
        name: $scope.name, 
        code: $scope.code, 
        address: $scope.address
      };

      /* Save the article using the Listings factory */
      Listings.create(listing)
              .then(function(response) {
                //if the object is successfully saved redirect back to the list page
                $state.go('listings.list', { successMessage: 'Listing succesfully created!' });
              }, function(error) {
                //otherwise display the error
                $scope.error = 'Unable to save listing!\n' + error;
              });
    };

    $scope.update = function(isValid) {
      Listings.update($scope.listing._id, $scope.listing);
    };

    $scope.remove = function() {

      Listings.delete($scope.listing._id);

    };

    /* Bind the success message to the scope if it exists as part of the current state */
    if($stateParams.successMessage) {
      $scope.success = $stateParams.successMessage;
    }

    /* Map properties */
    $scope.map = {
      center: {
        latitude: 29.65163059999999,
        longitude: -82.3410518
      }, 
      zoom: 14
    }

    $scope.$watch(function() {
      return $scope.map.bounds;
    }, function(nv, ov) {
      // Only need to regenerate once
      if (!ov.southwest && nv.southwest) {
        var markers = [];
        for (var i = 0; i < 50; i++) {
          markers.push($scope.listingMarkers[i]);
        }
        $scope.randomMarkers = markers;
      }
    }, true);

    // $scope.getCoordinates = function() {
    //   Listings.getAll().then(function(response) {
    //     $scope.listings = response.data;
    //     var markers = [];
    //     console.log('Listings: ' + JSON.stringify($scope.listings) );
    //     for (var i in $scope.listings) {
    //       var tempListing = $scope.listings[i];
    //       console.log('Lat: ' + tempListing.coordinates.latitude + '\tLong: ' + tempListing.coordinates.longitude + '\n');
    //       if (tempListing.coordinates !== undefined && tempListing.coordinates !== null) {
    //         console.log('Lat: ' + tempListing.coordinates.latitude + '\tLong: ' + tempListing.coordinates.longitude + '\n');
    //         var coords = {
    //           latitude: tempListing.coordinates.latitude,
    //           longitude: tempListing.coordinates.longitude,
    //           title: tempListing.name
    //         };
    //         coords[idKey] = i;
    //         markers.push(coords);
    //       }
    //     }
    //     $scope.listingMarkers = markers;
    //   }, function(error) {
    //     $scope.loading = false;
    //     $scope.error = 'Unable to retrieve listings!\n' + error;
    //   });

    //   };

      var createRandomMarker = function(i, bounds, idKey) {
        var lat_min = bounds.southwest.latitude,
          lat_range = bounds.northeast.latitude - lat_min,
          lng_min = bounds.southwest.longitude,
          lng_range = bounds.northeast.longitude - lng_min;

        if (idKey == null) {
          idKey = "id";
        }

        var myListing = $scope.listings[i];
        var latitude = lat_min + (Math.random() * lat_range);
        var longitude = lng_min + (Math.random() * lng_range);
        var ret = {
          latitude: latitude,
          longitude: longitude,
          title: 'm' + i
        };
        ret[idKey] = i;
        return ret;
      };
      $scope.randomMarkers = [];
      // Get the bounds from the map once it's loaded
      $scope.$watch(function() {
        return $scope.map.bounds;
      }, function(nv, ov) {
        // Only need to regenerate once
        if (!ov.southwest && nv.southwest) {
          var markers = [];
          for (var i = 0; i < 50; i++) {
            markers.push(createRandomMarker(i, $scope.map.bounds))
          }
          $scope.randomMarkers = markers;
        }
      }, true);
    });
  }



]);