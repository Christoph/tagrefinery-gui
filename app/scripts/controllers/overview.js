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

    that.dataLoaded = false;
    that.result = false;

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('output', function (data) {
      that.dataLoaded = true;

      that.loadStats();
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
    };

    that.loadStats = function()
    {
      that.pre = stats.getPre();
      that.spell = stats.getSpell();
      that.comp = stats.getComp();
      that.post = stats.getPost();
    };

    $scope.$on("guidedResult", function() {
      that.result = true;
    });

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
      enableGridMenu: true,
      onRegisterApi: function (gridApi) {
        that.gridApi = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          that.getHistory(row.entity.tag, row.entity.item);
        });
      },
      columnDefs: [
        {field: 'tag', minWidth: 100, width: "*"},
        {field: 'item', displayName: "Item", minWidth: 100, width: "*"}
      ]
    };

  }]);
