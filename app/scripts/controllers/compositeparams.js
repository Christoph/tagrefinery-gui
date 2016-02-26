'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:CompositeparamsCtrl
 * @description
 * # CompositeparamsCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('CompositeparamsCtrl', ["$scope", "socket", "stats", function ($scope, socket, stats) {

    // Get instance of the class
    var that = this;

    that.maxGroupSize = 3;
    that.minOcc = 2;
    that.split = true;

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('compSizeParams', function (data) {
      that.maxGroupSize = data;
    });

    socket.on('compSplitParams', function (data) {
      that.split = data;
    });

    socket.on('compOccParams', function (data) {
      that.minOcc = data;
    });

    that.apply = function () {
      socket.emit("applyCompMaxSize", that.maxGroupSize);
      socket.emit("applyCompMinOcc", that.minOcc);
      socket.emit("applyCompSplit", that.split);
    };

  }]);
