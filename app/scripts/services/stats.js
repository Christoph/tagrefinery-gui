'use strict';

/**
 * @ngdoc service
 * @name tagrefineryGuiApp.stats
 * @description
 * # stats
 * Service in the tagrefineryGuiApp.
 */
angular.module('tagrefineryGuiApp')
  .service('stats', ["$rootScope", function ($rootScope) {

      var stats = {};

      stats.data = {};

      stats.write = function(key, value) {
          stats.data[key] = value;
      }

      stats.read = function(name) {
          return stats.data[name];
      }

      return stats;

  }]);
