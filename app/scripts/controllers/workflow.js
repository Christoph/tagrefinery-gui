'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:WorkflowCtrl
 * @description
 * # WorkflowCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('WorkflowCtrl', ["$scope", "socket", function ($scope, socket) {
    var that = this;

    // State variables
    that.guided = true;
    that.showStep = false;
    that.currentStep = 0;

    ////////////////////////////////////////////////
    // Start
    ////////////////////////////////////////////////

    socket.on('isGuided', function (data) {
      that.guided = data == "true";

      socket.emit("getParameters", "");
    });

    that.ok = function()
    {
      that.showStep = true;
    };

    that.next = function()
    {
      that.showStep = false;
      that.currentStep++;

      // Let the child apply changes
      $scope.$broadcast("apply");
    };

    that.apply = function()
    {
      // Let the child apply changes
      $scope.$broadcast("apply");

      socket.emit("computeWorkflow", "");
    }

  }]);
