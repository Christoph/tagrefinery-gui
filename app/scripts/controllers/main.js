'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.thatcontroller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('MainCtrl', ["$scope", "socket", "uiGridConstants", "$timeout", function ($scope, socket, uiGridConstants, $timeout) {
    var that = this;

    that.connectionStatus = false;

    ////////////////////////////////////////////////
    // Destroy
    ////////////////////////////////////////////////

    $scope.$on("$destroy", function() {
      socket.removeAllListeners('connect');
      socket.removeAllListeners('disconnect');
      socket.removeAllListeners('connect_error');
    });

    ////////////////////////////////////////////////
    // Socket
    ////////////////////////////////////////////////


    ////////////////////////////////////////////////
    // Global
    ////////////////////////////////////////////////

    socket.on('connect', function () {
      that.connectionStatus = true;
    });

    socket.on('disconnect', function () {
      that.connectionStatus = false;
    });

    socket.on('connect_error', function () {
      that.connectionStatus = false;
    });

  }]);
