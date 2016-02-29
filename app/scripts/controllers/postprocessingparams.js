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
    that.newUseAllWords = true;
    that.minWordLength = 3;
    that.newMinWordLength = 3;
    that.split = true;
    that.newSplit = true;

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('postAllParams', function (data) {
      that.useAllWords = data;
      that.newUseAllWords = data;
    });

    socket.on('postSplitParams', function (data) {
      that.split = data;
      that.newSplit = data;
    });

    socket.on('postLengthParams', function (data) {
      that.minWordLength = data;
      that.newMinWordLength = data;
    });

    that.apply = function () {
      socket.emit("applyPostParams", JSON.stringify([{minWordLength: that.minWordLength, useAll: that.useAllWords, split: that.split}]));

      that.params.$setPristine();
    };

    that.undo = function()
    {
      that.newUseAllWords = that.useAllWords;
      that.newMinWordLength = that.minWordLength;
      that.newSplit = that.split;

      that.params.$setPristine();
    }

  }]);
