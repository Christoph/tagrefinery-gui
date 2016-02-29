'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PostprocessingparamsCtrl
 * @description
 * # PostprocessingparamsCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PostprocessingparamsCtrl', ["$scope", "socket", "stats", function ($scope, socket, stats) {

    // Get instance of the class
    var that = this;

    that.useAllWords = true;
    that.minWordLength = 3;
    that.split = true;

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('postAllParams', function (data) {
      that.useAllWords = data;
    });

    socket.on('postSplitParams', function (data) {
      that.split = data;
    });

    socket.on('postLengthParams', function (data) {
      that.minWordLength = data;
    });

    that.apply = function () {
      socket.emit("applyPostParams", JSON.stringify([{minWordLength: that.minWordLength, useAll: that.useAllWords, split: that.split}]));

      socket.emit("applyPostLength", that.minWordLength);
      socket.emit("applyPostAll", that.useAllWords);
      socket.emit("applyPostSplit", that.split);
    };

  }]);
