'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:CompositefrequentCtrl
 * @description
 * # CompositefrequentCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('CompositefrequentCtrl', ["$scope", "socket", "uiGridConstants","$timeout","$uibModal", function ($scope, socket, uiGridConstants, $timeout, $uibModal) {

    // Get instance of the class
    var that = this;

    // Frequent
    that.newThresholdF = 0;
    that.dataF = [];
   
   ////////////////////////////////////////////////
   // D3 functions
   ////////////////////////////////////////////////

   that.getThresholdF = function(threshold)
    {
        $scope.$apply(function() {
            that.newThresholdF = threshold;

            if(that.showDetails)
            {
        		$timeout(function() {
           			that.scrollToF(that.getAboveRow(that.frequentGrid.data, that.newThresholdF),0);
           		})
            }
        });
    };

    // This function needs decreasing sorted data from the server
    that.getAboveRow = function(data, threshold) {
        var index = 0;

        for(var i = 0; i<data.length; i++)
        {
            if(data[i].strength < threshold)
            {
                if((threshold - data[i].strength) <= (data[i-1].strength - threshold))
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

   socket.on('frequentData', function(data) {
       that.dataF = JSON.parse(data);
   });

   socket.on('frequentGroups', function(data) {
       that.frequentGrid.data = JSON.parse(data);
   });

   socket.on('compFrequentParams', function(data) {
       that.newThresholdF = parseFloat(data);
   });

   that.apply = function() 
   {
       socket.emit("applyFrequentThreshold",""+that.newThresholdF);
   };

   ////////////////////////////////////////////////
   // Frequent Grid
   ////////////////////////////////////////////////
   
   // Helper
    that.scrollToF = function( rowIndex, colIndex ) {
        that.frequentGridApi.core.scrollTo( that.frequentGrid.data[rowIndex], that.frequentGrid.columnDefs[colIndex]);
        that.frequentGridApi.selection.selectRow(that.frequentGrid.data[rowIndex]);
    };

    // Grid

   that.frequentGrid = {
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
            that.frequentGridApi = gridApi;

            // Set frequent threshold
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                that.newThresholdF = row.entity.strength;
            });
        }, 
        columnDefs: [
        { field: 'group', minWidth: 100, width: "*"},
        { field: 'strength', minWidth: 100, width: "*", cellFilter: 'number:3',
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
       return _.sum(that.dataF, function(o) {
           return o.count;
       });
    }

    that.newCountF = function() {
       return _.sum(_.filter(that.dataF, function(d) {
           return d.value >= that.newThresholdF;
       }), function(o) {
           return o.count;
       });
    }

  }]);
