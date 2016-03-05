'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PreprocessingremoveCtrl
 * @description
 * # PreprocessingremoveCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PreprocessingremoveCtrl', ["$scope", "socket", function ($scope, socket) {

    // Get instance of the class
    var that = this;

    that.remove = "";
    that.newRemove = "";


    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('preRemoveParams', function (data) {
      that.remove = data;
      that.newRemove = that.remove;
    });

    $scope.$on("apply", function() {
      if(that.params.$dirty)
      {
        socket.emit("applyPreRemoveCharacters", that.newRemove);

        that.params.$setPristine();
      }
    });

    that.undo = function()
    {
      that.newRemove = that.remove;

      that.params.$setPristine();
    }

  }]);
