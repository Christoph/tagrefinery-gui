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
    that.free = true;
    that.linked = true;
    that.init = false;
    that.initRunning = false;
    that.preRunning = false;
    that.spellRunning = false;
    that.compRunning = false;

    $scope.showStep = false;
    $scope.currentStep = 0;

    ////////////////////////////////////////////////
    // Start
    ////////////////////////////////////////////////

    socket.on('isGuided', function (data) {
      if(data == "true")
      {
        that.guided = true;
        that.free = false;
        that.linked = false;
      }
      else
      {
        that.guided = false;
        that.free = false;
        that.linked = true;
      }

      that.init = true;
    });

    socket.on('computePre', function (data) {
      that.initRunning = data == "started"
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
    that.customize = function()
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

    that.ok = function()
    {
      $scope.showStep = false;
      $scope.currentStep++;

      if($scope.currentStep == 6)
      {
        $scope.showStep = true;
        $scope.$broadcast("guidedResult");
      }

      that.apply();
    };

    that.output = function()
    {
      $scope.$broadcast("guidedResult");
    };

    that.reset = function()
    {
      $scope.showStep = false;
      $scope.currentStep = 0;
    };

    that.advanced = function()
    {
      that.guided = false;
      that.free = true;

      socket.emit("selectMode", "free");
    };

    that.apply = function()
    {
      // Let the child apply changes
      $scope.$broadcast("apply");

      socket.emit("computeWorkflow", "");
    };

    that.getPercent = function()
    {
      return ($scope.currentStep / 6) * 100;
    }

  }]);
