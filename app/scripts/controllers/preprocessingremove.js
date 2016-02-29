'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PreprocessingremoveCtrl
 * @description
 * # PreprocessingremoveCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PreprocessingremoveCtrl', ["$scope", "socket", "stats", function ($scope, socket, stats) {

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

      stats.writePre("Removed Characters", that.newRemove);
    });

    that.apply = function () {
      socket.emit("applyPreRemoveCharacters", that.newRemove);

      stats.writePre("Removed Characters", that.newRemove);

      that.params.$setPristine();
    };

    that.undo = function()
    {
      that.newRemove = that.remove;

      stats.writePre("Removed Characters", that.newRemove);

      that.params.$setPristine();
    }

  }]);
