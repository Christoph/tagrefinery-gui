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

    // Unique
    that.thresholdU = 0.7;
    that.newThresholdU = 0;
    that.allowBackU = false;

    that.filterU = [0,1];
    that.filterHistoryU = [];

    that.dataU = [];

    // Frequent
    that.thresholdF = 0.3;
    that.newThresholdF = 0;

    that.filterF = [0,1];
    that.filterHistoryF = [];
    that.allowBackF = false;

    that.dataF = [];

    // Start in simple mode
    $scope.$parent.modeComp = 0;
   
   ////////////////////////////////////////////////
   // D3 functions
   ////////////////////////////////////////////////
   
   $scope.onClickU = function(extend)
   {
        $scope.$apply(function() {
            that.filterHistoryU.push(that.filterU);
            that.filterU = extend;

            // There is at least on element in the back log
            that.allowBackU = true;
        });
   };  
   
    that.resetU = function()
    {
        that.filterU = [0,1];
        that.filterHistoryU = [];

        that.allowBackU = false;
    }

    that.backU = function()
    {
        if(that.filterHistoryU.length > 0)
        {
            that.filterU = that.filterHistoryU.pop();
        }

        if(that.filterHistoryU.length == 0)
        {
            that.allowBackU = false;
        }
    }

   $scope.onClickF = function(extend)
   {
        $scope.$apply(function() {
            that.filterHistoryF.push(that.filterF);
            that.filterF = extend;

            // There is at least on element in the back log
            that.allowBackF = true;
        });
   };  

    that.resetF = function()
    {
        that.filterF = [0,1];
        that.filterHistoryF = [];

        that.allowBackF = false;
    }

    that.backF = function()
    {
        if(that.filterHistoryF.length > 0)
        {
            that.filterF = that.filterHistoryF.pop();
        }

        if(that.filterHistoryF.length == 0)
        {
            that.allowBackF = false;
        }
    }
    
   ////////////////////////////////////////////////
   // Slider functions
   ////////////////////////////////////////////////

    $scope.sliderU = {
        options: {
            start: function (event, ui) {  },
            stop: function (event, ui) { 
               $timeout(function() {
                   that.scrollToF(that.getAboveRow(that.uniqueGrid.data, that.newThresholdU),0);
               })
            }
        }
    };
    
    $scope.sliderF = {
        options: {
            start: function (event, ui) {  },
            stop: function (event, ui) { 
               $timeout(function() {
                   that.scrollToF(that.getAboveRow(that.frequentGrid.data, that.newThresholdF),0);
               })
            }
        }
    };

    // This function needs decreasing sorted data from the server
    that.getAboveRow = function(data, threshold) {
        var index = 0;

        for(var i = 0; i<data.length; i++)
        {
            if(data[i].strength <= threshold)
            {
                if(i > 0)
                {
                    if((threshold - data[i].strength) <= (data[i-1].strength - threshold))
                    {
                        index = i;
                    }
                    else
                    {
                        index = data[i-1].strength;
                    }
                }
                else
                {
                    index = 0;
                }
            }
        }

        return index;
    }
    
   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////

   socket.on('uniqueImportance', function(data) {
       that.dataU = JSON.parse(data);
   });

   socket.on('frequentImportance', function(data) {
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

