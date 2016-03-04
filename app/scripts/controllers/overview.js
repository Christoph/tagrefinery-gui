'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:OverviewCtrl
 * @description
 * # OverviewCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('OverviewCtrl', ["$scope", "socket", "stats", function ($scope, socket, stats) {

    // Get instance of the class
    var that = this;

    that.pre = [];
    that.spell = [];
    that.comp = [];
    that.post = [];

    that.history = [];
    that.state = "";

    $scope.$parent.loadStats = function()
    {
      that.pre = stats.getPre();
      that.spell = stats.getSpell();
      that.comp = stats.getComp();
      that.post = stats.getPost();
    }


    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('output', function (data) {
      that.grid.data = JSON.parse(data);
    });

    socket.on('history', function (data) {
      that.history = JSON.parse(data);
    });

    socket.on('outputState', function (data) {
      that.state = data;
    });

    that.getHistory = function(tag, item)
    {
      socket.emit("getHistory", JSON.stringify([{tag: tag, item: item}]))
    }

    ////////////////////////////////////////////////
    // Overview Grid
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
          that.getHistory(row.entity.tag, row.entity.carrier);
        });
      },
      columnDefs: [
        {field: 'tag', minWidth: 100, width: "*"},
        {field: 'carrier', displayName: "Item", minWidth: 100, width: "*"}
      ]
    };

  }]);
