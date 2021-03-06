'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.config: Routes
 * @description
 * # OverviewCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider
      .when("","/main")
      .otherwise("/main");

    $stateProvider
      .state('main', {
        url: "/main",
        templateUrl: "views/start.html",
        controller: "StartCtrl as ctrl",
        resolve: {
          initialData: function(fetchData) {
            return fetchData.get(["Running","Loaded"]);
          }
        }
      })
      .state('import', {
        url: "/import",
        templateUrl: "views/import.html",
        controller: "ImportCtrl as ctrl",
        resolve: {
          initialData: function(fetchData) {
            return fetchData.get(["StartImportData","Loaded"]);
          }
        }
      })
  }]);
