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

    stats.write("preRemove", that.remove);

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('preRemoveParams', function (data) {
      that.remove = data;
      that.newRemove = that.remove;
    });

    that.apply = function () {
      socket.emit("applyPreRemoveCharacters", that.remove);

      that.params.$setPristine();
    };

    that.undo = function()
    {
      that.newRemove = that.remove;

      that.params.$setPristine();
    }

  }]);
