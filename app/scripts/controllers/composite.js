'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:CompositeCtrl
 * @description
 * # CompositeCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('CompositeCtrl', ["$scope", "socket", "uiGridConstants", function ($scope, socket, uiGridConstants) {

   var that = this;
   that.uniqueThreshold = 0;
   that.frequentThreshold = 0;
   
   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////

   socket.on('uniqueGroups', function(data) {
       console.log(JSON.parse(data))
       that.uniqueGrid.data = JSON.parse(data);
   });

   socket.on('frequentGroups', function(data) {
       console.log(JSON.parse(data))
       that.frequentGrid.data = JSON.parse(data);
   });

   that.grouping = function()
   {
       socket.emit("getGroups","3");
   }

   ////////////////////////////////////////////////
   // Overview Grid
   ////////////////////////////////////////////////
   
   that.uniqueGrid = {
        enableFiltering: true,
        showGridFooter: true,
        fastWatch: true,
        multiSelect: false,
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        enableFullRowSelection: true,
        onRegisterApi: function(gridApi) {
            that.uniqueGridApi = gridApi;

            // Set unique threshold
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                that.uniqueThreshold = gridApi.selection.getSelectedGridRows()
                    .entity.strength;
            })
        }, 
        columnDefs: [
        { field: 'group'},
        { field: 'strength', cellFilter: 'number:3', filters: [
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
   // Overview Grid
   ////////////////////////////////////////////////
   
   that.frequentGrid = {
        enableFiltering: true,
        showGridFooter: true,
        fastWatch: true,
        multiSelect: false,
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        enableFullRowSelection: true,
        onRegisterApi: function(gridApi) {
            that.frequentGridApi = gridApi;

            // Set frequent threshold
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                that.frequentThreshold = gridApi.selection.getSelectedGridRows()
                    .entity.strength;
            })
        }, 
        columnDefs: [
        { field: 'group'},
        { field: 'strength', cellFilter: 'number:3', filters: [
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


  }]);
