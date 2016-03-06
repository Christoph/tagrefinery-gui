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

      console.log("getParams")
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

      console.log("local broadcast")
      // Let the child apply changes
      $scope.$broadcast("apply");
    };

    that.apply = function()
    {
      console.log("computeWorkflow")
      // Let the child apply changes
      $scope.$broadcast("apply");

      socket.emit("computeWorkflow", "");
    }

  }]);
