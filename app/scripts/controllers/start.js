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

    // Get resolved data
    that.running = initialData.Running;
    that.dataLoaded = initialData.Loaded;

    // Cleanup
    $scope.$on("$destroy", function() {
      console.log("ctrl destroy")
    })
  }]);
