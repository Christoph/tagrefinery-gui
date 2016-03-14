'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:WorkflowCtrl
 * @description
 * # WorkflowCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('WorkflowCtrl', ["$scope", "socket", "intros", function ($scope, socket, intros) {
    var that = this;

    // State variables
    that.init = false;
    that.initRunning = false;
    that.preRunning = false;
    that.spellRunning = false;
    that.compRunning = false;
    that.postRunning = false;

    that.mode = "";

    $scope.showStep = false;
    $scope.currentStep = 0;

    ////////////////////////////////////////////////
    // Start
    ////////////////////////////////////////////////

    socket.on('selectedMode', function (data) {
      that.mode = data;

      that.init = true;
    });

    socket.on('initRunning', function (data) {
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

    socket.on('computePost', function (data) {
      that.postRunning = data == "started"
    });

    // Choose value
    that.customize = function()
    {
      $scope.showStep =! $scope.showStep;

      if($scope.currentStep == 1)
      {
        socket.emit("getBlacklist", "")
      }
      if($scope.currentStep == 2)
      {
        socket.emit("getWhitelist", "")
      }

      if($scope.showStep)
      {
        if($scope.currentStep == 0)
        {
          intros.set("preFilter");
        }
        if($scope.currentStep == 1)
        {
          intros.set("preBlacklist");
        }
        if($scope.currentStep == 2)
        {
          intros.set("spellTruth");
        }
        if($scope.currentStep == 3)
        {
          intros.set("spellCorrect");
        }
        if($scope.currentStep == 4)
        {
          intros.set("compF");
        }
        if($scope.currentStep == 5)
        {
          intros.set("compU");
        }
        if($scope.currentStep == 7)
        {
          intros.set("postF");
        }
        if($scope.currentStep == 8)
        {
          intros.set("postS");
        }
      }
      else
      {
        intros.set("guided");
      }
    };

    that.ok = function()
    {
      $scope.showStep = false;
      $scope.currentStep++;
      intros.set("guided");

      if($scope.currentStep == 6 || $scope.currentStep == 10)
      {
        $scope.showStep = true;
        intros.set("result");
      }

      that.apply();
    };

    that.default = function()
    {
      $scope.showStep = false;
      $scope.currentStep++;
      intros.set("guided");

      if($scope.currentStep == 6)
      {
        $scope.showStep = true;
        intros.set("result");
      }

      if($scope.currentStep == 7)
      {
        $scope.showStep = true;
        intros.set("guidedFinal");
      }

      $scope.$broadcast("undo");
    };

    that.back = function()
    {
      $scope.showStep = false;
      $scope.currentStep--;
      intros.set("guided");
    };

    that.restartFinalize = function()
    {
      $scope.showStep = false;
      $scope.currentStep = 7;
    };

    that.goToAdvanced = function()
    {
      intros.set("advanced");
      socket.emit("selectMode", "free");
    };

    that.goToLinked = function()
    {
      intros.set("linked");
      socket.emit("selectMode", "linked");
    };

    that.apply = function()
    {
      // Let the child apply changes
      $scope.$broadcast("apply");

      socket.emit("computeWorkflow", "");
    };

    that.getPercent = function(max)
    {
      return ($scope.currentStep / max) * 100;
    };

    that.no7 = function()
    {
      $scope.showStep = false;
      $scope.currentStep++;
      intros.set("guidedFinal");

      $scope.$broadcast("noPostI");
    };

    that.no8 = function()
    {
      $scope.$broadcast("undo");

      $scope.showStep = false;
      $scope.currentStep++;
      intros.set("guidedFinal");
    };

    that.yes9 = function()
    {
      $scope.$broadcast("postSalvage");

      $scope.currentStep++;
      $scope.showStep = true;
      intros.set("result");
    };

    that.no9 = function()
    {
      $scope.currentStep++;
      $scope.showStep = true;
      intros.set("result");
    };


  }]);
