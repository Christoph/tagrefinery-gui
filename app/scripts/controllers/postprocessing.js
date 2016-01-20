'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PostprocessingCtrl
 * @description
 * # PostprocessingCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PostprocessingCtrl', ["$scope", "socket", "uiGridConstants", function ($scope, socket, uiGridConstants) {

    var that = this;
    that.data = [];

   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////

   socket.on('postVocab', function(data) {
       that.data = JSON.parse(data);
   });

   socket.on('simGrid', function(data) {
       console.log(data);
       //that.frequentGrid.data = JSON.parse(data);
   });

   that.getImportantWords = function()
   {
       socket.emit("getPostVocab","0");
   };

    ////////////////////////////////////////////////
    // D3 functions
    ////////////////////////////////////////////////

    $scope.onClick = function(item)
    {
        $scope.$apply(function() {
            alert("Clicked"+item);
        });
    };

    that.addData = function() {
        socket.emit("getPostVocab","0");
    };

  }]);
