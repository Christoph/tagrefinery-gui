'use strict';

/**
 * @ngdoc service
 * @name tagrefineryGuiApp.httpLoader
 * @description
 * # httpLoader
 * Factory in the tagrefineryGuiApp.
 */
angular.module('tagrefineryGuiApp')
  .factory('httpLoader', ["$http", function ($http) {
      return function(url) {
          return $http.get(url);
      };
  }]);
