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
   that.data = [];

   // Start in simple mode
   $scope.$parent.mode = 0;

   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////

   socket.on('vocab', function(data) {
       that.vocabGrid.data = JSON.parse(data);
       that.data = JSON.parse(data);
   });

   socket.on('cluster', function(data) {
       var cluster = JSON.parse(data);

       if(cluster.length < 1) 
       {
            cluster.push({tag:"No cluster", similarity: 0});
       }

       that.simGrid.data = cluster;
   });

   that.clustering = function()
   {
       socket.emit("clustering","3");
   };

   that.apply = function()
   {
       if(that.threshold !== that.newThreshold)
       {
           that.threshold = that.newThreshold;

           socket.emit("applyClustering",""+that.threshold);
       }
   };

   ////////////////////////////////////////////////
   // Vocab Grid
   ////////////////////////////////////////////////
   
    // Helper functions
    
    that.getSimWords = function(tag)
    {
        socket.emit("getCluster", tag);
    };

    // Grid
    
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
        { field: 'tag', minWidth: 100, width: "*"}, 
        { field: 'importance', minWidth: 100, width: "*", 
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

    // Export
    
    that.exportVocab = function() {
        var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));

        that.vocabGridApi.exporter.csvExport("all","all",myElement);
    };

   ////////////////////////////////////////////////
   // Similarity Grid
   ////////////////////////////////////////////////
   
    // Helper 
    
    that.exportCluster = function() {
        var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));

        that.simGridApi.exporter.csvExport("all","all", myElement);
    };

    that.simGrid = {
        multiSelect: false,
        enableFiltering: true,
        showGridFooter: true,
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        enableFullRowSelection: true,
        onRegisterApi: function(gridApi) {
            that.simGridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if(row.entity.similarity > 0) 
                {
                    that.newThreshold = row.entity.similarity;
                }

                // Tells the grid to redraw after click
                gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
            });
        },
        columnDefs: [
        { field: 'tag', minWidth: 100, width: "*" },
        { field: 'similarity', minWidth: 100, width: "*",
            cellFilter: 'number:6', filters: [
            {
              condition: uiGridConstants.filter.GREATER_THAN,
              placeholder: 'greater than'
            },
            {
              condition: uiGridConstants.filter.LESS_THAN,
              placeholder: 'less than'
            }
            ],
            cellClass: function(grid, row, col) 
            { 
                var sim = grid.getCellValue(row,col);

                if(that.newThreshold > that.threshold)
                {
                   if(sim >= that.newThreshold) 
                   {
                        return 'current';    
                   }
                }
                else
                {
                    if(sim >= that.threshold) 
                    {
                        return 'current';
                    }
                }
                if(sim >= that.newThreshold && sim < that.threshold)
                {
                    return 'more';  
                } 
                if(sim < that.newThreshold && sim >= that.threshold)
                {
                    return 'less';
                } 
            }
        }]
    };
    
  }]);
