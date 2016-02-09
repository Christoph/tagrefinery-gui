'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PreprocessingCtrl
 * @description
 * # PreprocessingCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PreprocessingCtrl', ["$scope", "socket", "uiGridConstants","$timeout","$uibModal", function ($scope, socket, uiGridConstants, $timeout, $uibModal) {

   var that = this;

   that.similarity = 0.65;
   that.newSimilarity = 0.65;
   that.dataS = [];


   that.importance = 0.65;
   that.newImportance = 0.65;
   that.dataI = [];


   that.replacements = 0;
   that.newReplacements = 0;

   // Start in simple mode
   $scope.$parent.modePre = 0;

   ////////////////////////////////////////////////
   // Helper
   ////////////////////////////////////////////////

   that.countReplacements = function()
   {
       return _.sum(_.filter(that.dataS, function(d) {
           return d.value >= that.similarity;
       }), function(o) {
           return o.count;
       });
   };

   that.countNewReplacements = function()
   {
       return _.sum(_.filter(that.dataS, function(d) {
           return d.value >= that.newSimilarity;
       }), function(o) {
           return o.count;
       });
   };

    that.help = function (size) {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'templates/preHelp.html',
          controller: 'PreHelpCtrl',
          size: size
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
    };

    that.helpAdv = function (size) {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'templates/preHelpAdv.html',
          controller: 'PreHelpCtrl',
          size: size
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
    };

   ////////////////////////////////////////////////
   // D3 functions
   ////////////////////////////////////////////////

    that.getNewSimilarity = function(threshold)
    {
        $scope.$apply(function() {
            that.newSimilarity = threshold;

            that.getReplacements();
        });
    };

    that.getNewImportance = function(threshold)
    {
        $scope.$apply(function() {
            that.newImportance = threshold;

           $timeout(function() {
               //that.scrollToV(that.getAboveRow(that.vocabGrid.data, that.newImportance),0);
               that.scrollToV(0,0);
               
           })
        });
    };
    
    // This function needs decreasing sorted data from the server
    that.getAboveRow = function(data, threshold) {
        var index = 0;

        for(var i = 0; i<data.length; i++)
        {
            if(data[i].importance < threshold)
            {
                if((threshold - data[i].importance) <= (data[i-1].importance - threshold))
                {
                    return i;
                }
                else
                {
                    return i-1;
                }
            }
        }

        return index;
    }
    
   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////

   socket.on('replacements', function(data) {
       that.replGrid.data = JSON.parse(data);

       $timeout(function() {
           that.scrollToR(0,0);
       })
   });

   socket.on('vocab', function(data) {
       that.vocabGrid.data = JSON.parse(data);
   });

   socket.on('importance', function(data) {
       that.dataI = JSON.parse(data);
   });

   socket.on('similarities', function(data) {
       that.dataS = JSON.parse(data);
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
       if(that.threshold !== that.current)
       {
           that.threshold = that.current;

           socket.emit("applyClustering",""+that.threshold);
       }
   };

   ////////////////////////////////////////////////
   // Replacement Grid
   ////////////////////////////////////////////////
   
    // Helper functions
    
    that.getReplacements = function()
    {
        socket.emit("getReplacements", that.newSimilarity);
    };

    that.scrollToR = function( rowIndex, colIndex ) {
        that.replGridApi.core.scrollTo( that.replGrid.data[rowIndex], that.replGrid.columnDefs[colIndex]);
        that.replGridApi.selection.selectRow(that.replGrid.data[rowIndex]);
    };

    // Grid
    
    that.replGrid = {
        enableFiltering: false,
        enableColumnMenus: false,
        enableGridMenu: true,
        showGridFooter: false,
        fastWatch: true,
        multiSelect: false,
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        enableFullRowSelection: true,
        onRegisterApi: function(gridApi) {
            that.replGridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                that.newThreshold = row.entity.similarity;
            });
        },
        columnDefs: [
        { field: 'truth', minWidth: 100, width: "*"}, 
        { field: 'replacement', minWidth: 100, width: "*"}, 
        { field: 'similarity', minWidth: 100, width: "*", cellFilter: 'number:6',
            sort: {
                direction: uiGridConstants.DESC,
                priority: 1
            }
        }
        ]
    };

   ////////////////////////////////////////////////
   // Vocab Grid
   ////////////////////////////////////////////////
   
    // Helper functions
    
    that.scrollToV = function( rowIndex, colIndex ) {
        that.vocabGridApi.core.scrollTo( that.vocabGrid.data[rowIndex], that.vocabGrid.columnDefs[colIndex]);
        that.vocabGridApi.selection.selectRow(that.vocabGrid.data[rowIndex]);
    };

    that.getSimWords = function(tag)
    {
        socket.emit("getCluster", tag);
    };

    // Grid
    
    that.vocabGrid = {
        enableFiltering: true,
        showGridFooter: true,
        enableColumnMenus: false,
        enableGridMenu: true,
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
            sort: {
                direction: uiGridConstants.DESC,
                priority: 1
            },
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

   ////////////////////////////////////////////////
   // Similarity Grid
   ////////////////////////////////////////////////
   
    // Grid

    that.simGrid = {
        multiSelect: false,
        enableColumnMenus: false,
        enableFiltering: true,
        showGridFooter: true,
        enableGridMenu: true,
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
            sort: {
                direction: uiGridConstants.DESC,
                priority: 1
            },
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

                if(that.newImportance > that.importance)
                {
                   if(sim >= that.newImportance) 
                   {
                        return 'current';    
                   }
                }
                else
                {
                    if(sim >= that.importance) 
                    {
                        return 'current';
                    }
                }
                if(sim >= that.newImportance && sim < that.importance)
                {
                    return 'more';  
                } 
                if(sim < that.newImportance && sim >= that.importance)
                {
                    return 'less';
                } 
            }
        }]
    };
    
  }]);
