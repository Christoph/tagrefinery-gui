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
    that.guided = false;
    that.preRunning = false;
    that.spellRunning = false;
    that.compRunning = false;

    $scope.showStep = false;
    $scope.currentStep = 0;

    ////////////////////////////////////////////////
    // Start
    ////////////////////////////////////////////////

    socket.on('isGuided', function (data) {
      that.guided = data == "true";
    });

    socket.on('computePre', function (data) {
      that.preRunning = data == "started"
    });

    socket.on('computeSpell', function (data) {
      that.spellRunning = data == "started"
    });

    socket.on('computeComp', function (data) {
      that.compRunning = data == "started"
    });


    // Choose value
    that.custom = function()
    {
      $scope.showStep = true;

      if($scope.currentStep == 1)
      {
        socket.emit("getBlacklist", "")
      }
      if($scope.currentStep == 2)
      {
        socket.emit("getWhitelist", "")
      }
    };

    // Apply default values
    that.ok = function()
    {
      $scope.showStep = false;
      $scope.currentStep++;

      that.apply();
    };

    // Apply no value
    that.next = function()
    {
      $scope.showStep = false;
      $scope.currentStep++;

      that.apply();
    };

    that.showResults = function()
    {
      $scope.currentStep = 9;
      $scope.showStep = true;
      $scope.$broadcast("guidedResult");
    }

    that.output = function()
    {
      $scope.$broadcast("guidedResult");
    }

    that.reset = function()
    {
      $scope.currentStep = 0;
      $scope.showStep = false;
    }

    that.advanced = function()
    {
      that.guided = false;

      socket.emit("selectMode", "free");
    }

    that.apply = function()
    {
      // Let the child apply changes
      $scope.$broadcast("apply");

      socket.emit("computeWorkflow", "");
    }

  }]);
