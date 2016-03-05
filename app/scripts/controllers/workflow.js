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

    that.switchMode = function()
    {
      that.guided = !that.guided;

      socket.emit("getParameters", "");
    };

    that.ok = function()
    {
      that.showStep = true;
    }

    that.next = function()
    {
      that.showStep = false;
      that.currentStep++;
    }

  }]);
