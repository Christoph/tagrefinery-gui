'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PreprocessingCtrl
 * @description
 * # PreprocessingCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PreprocessingCtrl', ["$scope", "socket", "uiGridConstants","$timeout","$uibModal", function ($scope, socket, uiGridConstants,$timeout,$uibModal) {

   var that = this;
   that.threshold = 0.65;
   that.replacements = 0;
   that.newThreshold = 0.65;
   that.newReplacements = 0;
   that.data = [];
   that.filterList = [];
   that.filter = [0,1];
   that.showSlider = false;
   that.allowBack = true;

   // Start in simple mode
   $scope.$parent.mode = 0;

   ////////////////////////////////////////////////
   // Helper
   ////////////////////////////////////////////////

   that.countReplacements = function()
   {
       return _.sum(_.filter(that.data, function(d) {
           return d.value >= that.threshold;
       }), function(o) {
           return o.count;
       });
   };

   that.countNewReplacements = function()
   {
       return _.sum(_.filter(that.data, function(d) {
           return d.value >= that.newThreshold;
       }), function(o) {
           return o.count;
       });
   };

    $scope.slider = {
        options: {
            start: function (event, ui) {  },
            stop: function (event, ui) { that.getReplacements(that.newThreshold); }
        }
    };

    $scope.items = ['item1', 'item2', 'item3'];
    that.help = function (size) {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'templates/preHelp.html',
          controller: 'PreHelpCtrl',
          size: size,
          resolve: {
            items: function () {
              return $scope.items;
            }
          }
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

    $scope.onClick = function(extend)
    {
        $scope.$apply(function() {
            that.filterList.push(that.filter);
            that.filter = extend;

            // There is at least on element in the back log
            that.allowBack = false;
        });
    };

    that.reset = function()
    {
        that.filter = [0,1];
        that.filterList = [];

        that.allowBack = true;
    }

    that.back = function()
    {
        if(that.filterList.length > 0)
        {
            that.filter = that.filterList.pop();
        }

        if(that.filterList.length == 0)
        {
            that.allowBack = true;
        }
    }

   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////

   socket.on('replacements', function(data) {
       that.replGrid.data = JSON.parse(data);
       
       $timeout(function() {
           that.scrollTo(0,0);
       })
   });

   socket.on('vocab', function(data) {
       that.vocabGrid.data = JSON.parse(data);
   });

   socket.on('similarities', function(data) {
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
        socket.emit("getReplacements", that.newThreshold);
    };

    that.scrollTo = function( rowIndex, colIndex ) {
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

    // Export
    
    that.exportRepl = function() {
        var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));

        that.replGridApi.exporter.csvExport("all","all",myElement);
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
        enableColumnMenus: false,
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
                priority: 0
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

    // Grid

    that.simGrid = {
        multiSelect: false,
        enableColumnMenus: false,
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
            sort: {
                direction: uiGridConstants.DESC,
                priority: 0
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
