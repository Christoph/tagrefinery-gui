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
      .state("index", {
        abstract: true,
        url: "",
        templateUrl: "views/disconnected.html",
        controller: "MainCtrl as ctrl"
      })
      .state('index.main', {
        url: "/main",
        templateUrl: "views/start.html",
        controller: "StartCtrl as ctrl",
        resolve: {
          initialData: function(startInitData) {
            return startInitData;
          }

        }
      })
      .state('index.import', {
        url: "/import",
        templateUrl: "views/import.html",
        controller: "ImportCtrl as ctrl"
      })
  }]);
