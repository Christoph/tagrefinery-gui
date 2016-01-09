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

   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////

   socket.on('vocabGrid', function(data) {
       console.log(data);
       //that.uniqueGrid.data = JSON.parse(data);
   });

   socket.on('simGrid', function(data) {
       console.log(data);
       //that.frequentGrid.data = JSON.parse(data);
   });

   that.grouping = function()
   {
       //socket.emit("getGroups","3");
   };

    ////////////////////////////////////////////////
    // D3 functions
    ////////////////////////////////////////////////

    // hard-code data
    that.tempdata = [
        {name: 'Greg', score: 98},
        {name: 'Ari', score: 96},
        {name: 'Q', score: 75},
        {name: 'Loser', score: 48}
    ];

    that.addData = function() {
        socket.emit("initialize","test");
        that.tempdata.push({
            name: 'Added',
            score: 50
        });
    };

  }]);
