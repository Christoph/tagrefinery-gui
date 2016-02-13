'use strict';
/* jshint -W117 */

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.thatroller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('MainCtrl', ["$scope", "socket", "uiGridConstants", function ($scope, socket, uiGridConstants) {
   var that = this;

   var connectionStatus = false;
   $scope.$parent.disconnected = true;

   socket.on('connect', function(data) {
       	that.connectionStatus = true;
       	$scope.$parent.disconnected = false;
   });

    socket.on('disconnect', function(data) {
       	that.connectionStatus = false;
       	$scope.$parent.disconnected = true;
       	$scope.$parent.activeTabs[0] = true;
   });

    socket.on('connect_error', function(data) {
       	that.connectionStatus = false;
       	$scope.$parent.disconnected = true;
       	$scope.$parent.activeTabs[0] = true;
   });

   that.reconnect = function() 
   {
       	socket.reconnect();
   };

 }]);
