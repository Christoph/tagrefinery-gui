'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:OverviewCtrl
 * @description
 * # OverviewCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('index', {
        url: "",
        templateUrl: "views/start.html",
        controller: "StartCtrl as ctrl",
        resolve: {
          initialData: function(startInitData) {
            return startInitData;
          }

        }
      })
      .state('import', {
        url: "/import",
        templateUrl: "views/import.html",
        controller: "MainCtrl as ctrl"
      })
  }]);
