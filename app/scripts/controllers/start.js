'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.thatcontroller:StartCtrl
 * @description
 * # StartCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('StartCtrl', ["$scope", "initialData", function ($scope, initialData) {
    var that = this;

    console.log(initialData)

    that.running = initialData.running;
    that.dataLoaded = initialData.loaded;

    $scope.$on("$destroy", function() {
      console.log("ctrl destroy")
    })
  }]);
