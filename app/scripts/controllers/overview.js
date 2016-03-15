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

    that.exportCSV = function()
    {
      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
      that.gridApi.exporter.csvExport( 'all', 'all', myElement );
    };

    ////////////////////////////////////////////////
    // Overview Grid
    ////////////////////////////////////////////////

    // Grid
    var rowtemplate = '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'current\': grid.appScope.isCurrent( row ) }" ui-grid-cell></div>';

    $scope.isCurrent = function(row)
    {
      return row.entity.changed == 1;
    };

    that.grid = {
      rowTemplate: rowtemplate,
      enableFiltering: true,
      enableColumnMenus: false,
      multiSelect: false,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      enableGridMenu: true,
      exporterPdfDefaultStyle: {fontSize: 9},
      exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
      exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
      exporterPdfOrientation: 'portrait',
      exporterPdfPageSize: 'LETTER',
      exporterPdfMaxGridWidth: 500,
      onRegisterApi: function (gridApi) {
        that.gridApi = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          that.getHistory(row.entity.tag, row.entity.item);
        });
      },
      columnDefs: [
        {field: 'tag', minWidth: 100, width: "*"},
        {field: 'item', displayName: "Item", minWidth: 100, width: "*"},
        {field: 'weight', displayName: "Weight", minWidth: 50, width: 100},
        {field: 'changed', displayName: "Tag has Changed", minWidth: 50, width: "*", visible: false}
      ]
    };

  }]);
