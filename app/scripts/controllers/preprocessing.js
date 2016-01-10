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
   that.threshold = 0.65;
   that.newThreshold = 0.65;
   
   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////

   socket.on('vocab', function(data) {
       that.vocabGrid.data = JSON.parse(data);
   });

   socket.on('cluster', function(data) {
       var cluster = JSON.parse(data);

       if(cluster.length < 1) cluster.push({tag:"No cluster", similarity: 0});

       that.simGrid.data = cluster;
   });

   that.clustering = function()
   {
       socket.emit("clustering","3");
   };

   that.apply = function()
   {
       if(that.threshold != that.newThreshold)
       {
           console.log("clusterning")
           that.threshold = that.newThreshold;

           socket.emit("applyClustering",""+that.threshold);
       }
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
                that.getSimWords(row.entity.tag);
            });
        },
        columnDefs: [
        { field: 'tag' }, 
        { field: 'importance', 
            cellFilter: 'number:6', filters: [
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
    
    that.getSimWords = function(tag)
    {
        socket.emit("getCluster", tag);
    };


   ////////////////////////////////////////////////
   // Similarity Grid
   ////////////////////////////////////////////////
   
    that.simGrid = {
        multiSelect: false,
        showGridFooter: true,
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        enableFullRowSelection: true,
        onRegisterApi: function(gridApi) {
            that.simGridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if(row.entity.similarity > 0) that.newThreshold = row.entity.similarity;

                // Tells the grid to redraw after click
                gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
            });
        },
        columnDefs: [
        { field: 'tag' },
        { field: 'similarity', 
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) 
            { 
                var sim = grid.getCellValue(row,col);
                if(sim >= that.threshold) return 'current';
                if(sim >= that.newThreshold && sim < that.threshold) return 'more';
                if(sim < that.newThreshold && sim >= that.threshold) return 'less';
            }
        }]
    };
    
  }]);
