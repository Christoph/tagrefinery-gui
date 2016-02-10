'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:CompositeuniqueCtrl
 * @description
 * # CompositeuniqueCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('CompositeuniqueCtrl', ["$scope", "socket", "uiGridConstants","$timeout","$uibModal", function ($scope, socket, uiGridConstants, $timeout, $uibModal) {

    // Get instance of the class
    var that = this;

    // Unique
    that.thresholdU = 0.7;
    that.newThresholdU = 0.7;
    that.dataU = [];
   
   ////////////////////////////////////////////////
   // D3 functions
   ////////////////////////////////////////////////

   that.getThresholdU = function(threshold)
    {
        $scope.$apply(function() {
            that.newThresholdU = threshold;

            if(that.showDetails)
            {
	           $timeout(function() {
	               that.scrollToU(that.getAboveRow(that.uniqueGrid.data, that.newThresholdU),0);
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

   socket.on('uniqueData', function(data) {
       that.dataU = JSON.parse(data);
   });

   socket.on('uniqueGroups', function(data) {
       that.uniqueGrid.data = JSON.parse(data);
   });

   that.apply = function() 
   {
       socket.emit("applyUniqueGroups",""+that.newThresholdU);
   };

    // I accordian gets opened => initialize
	if($scope.$parent.status.open[1] == true)
	{
		socket.emit("getCompositeData","uniqueData");
		socket.emit("getCompositeData","uniqueGroups");
	}

   ////////////////////////////////////////////////
   // Unique Grid
   ////////////////////////////////////////////////
   
   // Helper
   
    that.scrollToU = function( rowIndex, colIndex ) {
        that.uniqueGridApi.core.scrollTo( that.uniqueGrid.data[rowIndex], that.uniqueGrid.columnDefs[colIndex]);
        that.uniqueGridApi.selection.selectRow(that.uniqueGrid.data[rowIndex]);
    };

    // Grid

   that.uniqueGrid = {
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
            that.uniqueGridApi = gridApi;

            // Set unique threshold
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                that.newThresholdU = row.entity.strength;
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
       return _.sum(that.dataU, function(o) {
           return o.count;
       });
    }

    that.newCountU = function() {
       return _.sum(_.filter(that.dataU, function(d) {
           return d.value >= that.newThresholdU;
       }), function(o) {
           return o.count;
       });
    }

  }]);
