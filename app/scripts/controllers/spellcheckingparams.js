'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:SpellcheckingparamsCtrl
 * @description
 * # SpellcheckingparamsCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('SpellcheckingparamsCtrl', ["$scope", "socket", function ($scope, socket) {

    // Get instance of the class
    var that = this;

    that.minWordSize = 0;
    that.newMinWordSize = 0;

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('spellMinWordSize', function (data) {
      that.minWordSize = data;
      that.newMinWordSize = that.minWordSize;
    });

    $scope.$on("apply", function() {
      if(that.params.$dirty)
      {
        socket.emit("applySpellMinWordSize", that.newMinWordSize);

        that.params.$setPristine();
      }
    });

    that.undo = function()
    {
      that.newMinWordSize = that.minWordSize;

      that.params.$setPristine();
    }

  }]);
