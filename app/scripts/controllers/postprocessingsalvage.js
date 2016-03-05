'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PostprocessingsalvageCtrl
 * @description
 * # PostprocessingsalvageCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PostprocessingsalvageCtrl', ["$scope", "socket", "stats", function ($scope, socket, stats) {

    // Get instance of the class
    var that = this;

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('postSalvageWords', function (data) {
      that.grid.data = JSON.parse(data);
    });

    socket.on('postSalvageData', function (data) {
      that.salvage.data = JSON.parse(data);

      stats.writePost("Number of Salvaged Tags", that.salvage.data.length);
    });

    that.salvaging = function () {
      socket.emit("computeSalvaging", "");
    };

    that.apply = function () {
      socket.emit("applySalvaging", "");
    };

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
      onRegisterApi: function (gridApi) {
        that.gridApi = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        });
      },
      columnDefs: [
        {field: 'tag', minWidth: 100, width: "*"}
      ]
    };

    ////////////////////////////////////////////////
    // Salvaging
    ////////////////////////////////////////////////

    // Grid

    that.salvage = {
      enableFiltering: true,
      enableColumnMenus: false,
      multiSelect: false,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      enableullRowSelection: true,
      enableGridMenu: true,
      onRegisterApi: function (gridApi) {
        that.salvageGridApi = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {

        });
      },
      columnDefs: [
        {field: 'truth', displayName: 'Important Tag', minWidth: 100, width: "*"},
        {field: 'replacement', displayName: 'Salvaged Tag', minWidth: 100, width: "*"}
      ]
    };

  }]);
