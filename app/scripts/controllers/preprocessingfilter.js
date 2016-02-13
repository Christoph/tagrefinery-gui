'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PreprocessingfilterCtrl
 * @description
 * # PreprocessingfilterCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PreprocessingfilterCtrl', ["$scope", "socket", "uiGridConstants","$timeout","stats", function ($scope, socket, uiGridConstants, $timeout, stats) {

    // Get instance of the class
    var that = this;

    // Frequent
    that.threshold = 0;
    that.data = [];

    stats.write("preFilter",that.threshold);
   
   ////////////////////////////////////////////////
   // D3 functions
   ////////////////////////////////////////////////

   that.getThreshold = function(threshold)
    {
        $scope.$apply(function() {
            that.threshold = threshold;

            if(that.showDetails)
            {
        		$timeout(function() {
           			that.scrollTo(that.getAboveRow(that.grid.data, that.threshold),0);
           		})
            }
        });
    };

    // This function needs decreasing sorted data from the server
    that.getAboveRow = function(data, threshold) {
        var index = 0;

        for(var i = 0; i<data.length; i++)
        {
            if(data[i].importance > threshold)
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

   socket.on('preFilterData', function(data) {
       that.data = JSON.parse(data);
   });

   socket.on('preFilterGrid', function(data) {
       that.grid.data = JSON.parse(data);
   });

   socket.on('preFilterParams', function(data) {
       that.threshold = parseFloat(data);
   });

   that.apply = function() 
   {
       socket.emit("applyPrefilter",""+that.threshold);
   };

   ////////////////////////////////////////////////
   // requent Grid
   ////////////////////////////////////////////////
   
   // Helper
    that.scrollTo = function( rowIndex, colIndex ) {
        that.gridApi.core.scrollTo( that.grid.data[rowIndex], that.grid.columnDefs[colIndex]);
        that.gridApi.selection.selectRow(that.grid.data[rowIndex]);
    };

    // Grid

   that.grid = {
        enableFiltering: false,
        enableColumnMenus: false,
        enableGridMenu: true,
        showGridooter: false,
        fastWatch: true,
        multiSelect: false,
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        enableullRowSelection: true,
        onRegisterApi: function(gridApi) {
            that.gridApi = gridApi;

            // Set frequent threshold
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                that.threshold = row.entity.importance;
            });
        }, 
        columnDefs: [
        { field: 'tag', minWidth: 100, width: "*"},
        { field: 'importance', minWidth: 100, width: "*", cellFilter: 'number:4',
            sort: {
                direction: uiGridConstants.DESC,
                priority: 1
            }
        }
        ]
    };

   ////////////////////////////////////////////////
   // Helper functions
   ////////////////////////////////////////////////

    that.totalReplacements = function() {
       return _.sum(that.data, function(o) {
           return o.count;
       });
    }

    that.newCount = function() {
       return _.sum(_.filter(that.data, function(d) {
           return d.value < that.threshold;
       }), function(o) {
           return o.count;
       });
    }

  }]);
