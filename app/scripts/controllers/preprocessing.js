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
   
   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////

   socket.on('vocab', function(data) {
       that.vocabGrid.data = JSON.parse(data);
   });

   socket.on('simGrid', function(data) {
       console.log(data);
       that.simGrid.data = JSON.parse(data);
   });

   that.grouping = function()
   {
       //socket.emit("getGroups","3");
   };

   ////////////////////////////////////////////////
   // Vocab Grid
   ////////////////////////////////////////////////
   
    that.vocabGrid = {
        enableFiltering: true,
        showGridFooter: true,
        fastWatch: true,
        multiSelect: false,
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        enableFullRowSelection: true,
        onRegisterApi: function(gridApi) {
            that.vocabGridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                console.log(row.entity);
                that.getSimWords(row);
            });
        },
        columnDefs: [
        { field: 'tag'},
        { field: 'importance', cellFilter: 'number:6', filters: [
            {
              condition: uiGridConstants.filter.GREATER_THAN,
              placeholder: 'greater than'
            },
            {
              condition: uiGridConstants.filter.LESS_THAN,
              placeholder: 'less than'
            }
        ]}
        ]
    };

    // Helper functions
    
    that.getSimWords = function(row)
    {
        
    };


   ////////////////////////////////////////////////
   // Similarity Grid
   ////////////////////////////////////////////////
   
    that.simGrid = {
        columnDefs: [
        { field: 'tag' },
        { field: 'similarity' }
        ]
    };
    
  }]);
