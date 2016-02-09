'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:CompositeCtrl
 * @description
 * # CompositeCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
   .controller('CompositeCtrl', ["$scope", "socket", "uiGridConstants","$timeout","$uibModal", function ($scope, socket, uiGridConstants, $timeout, $uibModal) {

    // Get instance of the class
    var that = this;

    // Frequent
    that.thresholdF = 0.3;
    that.newThresholdF = 0;
    that.dataF = [];

    // Unique
    that.thresholdU = 0.7;
    that.newThresholdU = 0;
    that.dataU = [];

    // Start in simple mode
    $scope.$parent.modeComp = 0;
   
   ////////////////////////////////////////////////
   // D3 functions
   ////////////////////////////////////////////////

   that.getThresholdF = function(threshold)
    {
        $scope.$apply(function() {
            that.newThresholdF = threshold;

           $timeout(function() {
               that.scrollToF(that.getAboveRow(that.frequentGrid.data, that.newThresholdF),0);
           })
        });
    };

   that.getThresholdU = function(threshold)
    {
        $scope.$apply(function() {
            that.newThresholdU = threshold;

           $timeout(function() {
               that.scrollToU(that.getAboveRow(that.uniqueGrid.data, that.newThresholdU),0);
           })
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

   socket.on('uniqueStrength', function(data) {
       that.dataU = JSON.parse(data);
   });

   socket.on('frequentStrength', function(data) {
       that.dataF = JSON.parse(data);
   });

   socket.on('uniqueGroups', function(data) {
       that.uniqueGrid.data = JSON.parse(data);
   });

   socket.on('frequentGroups', function(data) {
       that.frequentGrid.data = JSON.parse(data);
   });

   that.grouping = function()
   {
       socket.emit("getGroups","3");
   };

   that.apply = function() 
   {
       socket.emit("applyGroups","");
   };

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
   
    that.apply = function()
    {
        console.log("bla")
    }
 
    that.countU = function() {
       return _.sum(_.filter(that.dataU, function(d) {
           return d.value >= that.thresholdU;
       }), function(o) {
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

    that.countF = function() {
       return _.sum(_.filter(that.dataF, function(d) {
           return d.value >= that.thresholdF;
       }), function(o) {
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

