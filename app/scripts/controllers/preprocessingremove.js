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

    stats.write("preRemove", that.remove);

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('preRemoveParams', function (data) {
      that.remove = data;
    });

    that.apply = function () {
      socket.emit("applyPreRemoveCharacters", that.remove);
    };

  }]);
