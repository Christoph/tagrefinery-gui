'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PreprocessingCtrl
 * @description
 * # PreprocessingCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PreprocessingCtrl', ["$scope", "socket", "uiGridConstants", function ($scope, socket, uiGridConstants) {
   var that = this;
   that.overview = [];
   that.history = [];
   
   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////

   socket.on('uniqueGroups', function(data) {
       that.uniqueGrid.data = JSON.parse(data);
   });

   socket.on('frequentGroups', function(data) {
       that.frequentGrid.data = JSON.parse(data);
   });

   that.grouping = function()
   {
       socket.emit("getGroups","3");
   }

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
          socket.emit("initialize","test")
          that.tempdata.push({
              name: 'Added',
              score: 50
          });
      };

   ////////////////////////////////////////////////
   // Word Grid
   ////////////////////////////////////////////////
   
    that.wordGrid = {
        multiSelect: false,
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        enableFullRowSelection: true,
        onRegisterApi: function(gridApi) {
            that.wordGroupApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                console.log('row changed'+row.entity[0]);
            })
        },
        columnsDef: [
        { field: 'key' },
        { field: 'value', cellFilter: 'number:6' }
        ]
    };


   ////////////////////////////////////////////////
   // Similarity Grid
   ////////////////////////////////////////////////
   
    that.simGrid = {
        columnDefs: [
        { field: 'Tag' },
        { field: 'Similarity' }
        ]
    };
    
  }]);
