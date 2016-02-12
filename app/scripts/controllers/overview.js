'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:OverviewCtrl
 * @description
 * # OverviewCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('OverviewCtrl', ["$scope", "socket", "uiGridConstants","$timeout","$q", function ($scope, socket, uiGridConstants, $timeout, $q) {

    // Get instance of the class
    var that = this;

    that.stats = [];

   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////

   socket.on('output', function(data) {
       that.grid.data = JSON.parse(data);
   });

    socket.emit("getOutputData","output");

   ////////////////////////////////////////////////
   // Grid
   ////////////////////////////////////////////////

    // Grid

   that.grid = {
        enableFiltering: true,
        enableColumnMenus: false,
        multiSelect: false,
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        enableullRowSelection: true,
        enableGridMenu: true,
        onRegisterApi: function(gridApi) {
            that.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                that.old = row.entity.tag;
            });
        }, 
        columnDefs: [
        { field: 'tag', minWidth: 100, width: "*"},
        { field: 'carrier', displayName: "Item", minWidth: 100, width: "*"},
        { field: 'importance', minWidth: 100, width: "*", cellFilter: 'number:4'}
        ]
    };



  }]);