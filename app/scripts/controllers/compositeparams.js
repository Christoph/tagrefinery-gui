'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:CompositeparamsCtrl
 * @description
 * # CompositeparamsCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('CompositeparamsCtrl', ["$scope", "socket", function ($scope, socket) {

    // Get instance of the class
    var that = this;

    that.maxGroupSize = 3;
    that.newMaxGroupSize = 0;
    that.minOcc = 2;
    that.newMinOcc = 0;
    that.split = true;
    that.newSplit = true;

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('compSizeParams', function (data) {
      that.maxGroupSize = data;
      that.newMaxGroupSize = data;
    });

    socket.on('compSplitParams', function (data) {
      that.split = data;
      that.newSplit = data;
    });

    socket.on('compOccParams', function (data) {
      that.minOcc = data;
      that.newMinOcc = data;
    });

    that.applyWatch = $scope.$on("apply", function() {
      if(that.params.$dirty)
      {
        socket.emit("applyCompositeParams", JSON.stringify([{maxGroupSize: that.newMaxGroupSize, minOcc: that.newMinOcc, split: that.newSplit}]));

        that.params.$setPristine();
      }
    });

    $scope.$on('$destroy', function() {
      that.applyWatch();
    });

    that.undo = function()
    {
      that.newMaxGroupSize = that.maxGroupSize;
      that.newMinOcc = that.minOcc;
      that.newSplit = that.split;

      that.params.$setPristine();
    }

  }]);
