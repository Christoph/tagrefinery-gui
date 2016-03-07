'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:WorkflowCtrl
 * @description
 * # WorkflowCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('WorkflowCtrl', ["$scope", "socket", "stats", function ($scope, socket, stats) {
    var that = this;

    // State variables
    that.guided = false;
    that.preRunning = false;
    that.spellRunning = false;
    that.compRunning = false;

    that.showStep = false;
    that.currentStep = 0;

    ////////////////////////////////////////////////
    // Start
    ////////////////////////////////////////////////

    socket.on('isGuided', function (data) {
      that.guided = data == "true";
      that.guided = true;
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
      that.showStep = true;
    };

    // Apply default values
    that.ok = function()
    {
      that.showStep = false;
      that.currentStep++;

      that.apply();
    };

    // Apply no value
    that.next = function()
    {
      that.showStep = false;
      that.currentStep++;

      that.apply();
    };

    that.showResults = function()
    {
      that.loadStats();
      that.currentStep = 9;
      that.showStep = true;
    }

    that.reset = function()
    {
      that.currentStep = 1;
      that.showStep = false;
    }

    that.advanced = function()
    {
      that.guided = false;
    }

    that.apply = function()
    {
      // Let the child apply changes
      $scope.$broadcast("apply");

      socket.emit("computeWorkflow", "");
    }

    that.loadStats = function()
    {
      that.pre = stats.getPre();
      that.spell = stats.getSpell();
      that.comp = stats.getComp();
      that.post = stats.getPost();
    };

  }]);
