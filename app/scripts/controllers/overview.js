'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:OverviewCtrl
 * @description
 * # OverviewCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('OverviewCtrl', ["$scope", "socket", "stats", "uiGridConstants", function ($scope, socket, stats, uiGridConstants) {

    // Get instance of the class
    var that = this;

    that.pre = [];
    that.spell = [];
    that.comp = [];
    that.post = [];
    that.vocabCount = [];
    that.datasetCount = [];

    that.history = [];
    that.state = "";

    that.dataLoaded = false;
    that.compRunning = false;
    that.postRunning = false;

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('output', function (data) {
      that.dataLoaded = true;

      that.loadStats();
      that.grid.data = JSON.parse(data);
      that.group.data = JSON.parse(data);
    });

    socket.on('history', function (data) {
      that.history = JSON.parse(data);
    });

    socket.on('outputState', function (data) {
      that.state = data;
    });

    socket.on('computeComp', function (data) {
      that.compRunning = data == "started"
    });

    socket.on('computePost', function (data) {
      that.postRunning = data == "started"
    });

    socket.on('resultVocab', function (data) {
      that.vocab.data = JSON.parse(data);
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
      that.vocabCount = stats.getVocab();
      that.datasetCount = stats.getDataset();
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
    var rowtemplate = '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'newItem\': grid.appScope.isCurrent( row ) }" ui-grid-cell></div>';

    $scope.isCurrent = function(row)
    {
      return row.entity.changed == 1;
    };

    that.grid = {
      rowTemplate: rowtemplate,
      showGridFooter: true,
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
        {field: 'changed', displayName: "Tag has Changed", minWidth: 50, width: "*", visible: false,
          sort: {
            direction: uiGridConstants.DESC,
            priority: 1
          }
        }
      ]
    };

    that.vocab = {
      enableFiltering: true,
      enableColumnMenus: false,
      enableGridMenu: true,
      showGridFooter: true,
      fastWatch: true,
      multiSelect: false,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      onRegisterApi: function (gridApi) {
        that.vocabGridApi = gridApi;
      },
      columnDefs: [
        {field: 'tag', minWidth: 100, width: "*"},
        {
          field: 'importance', minWidth: 100, width: "*", cellFilter: 'number:4',
          sort: {
            direction: uiGridConstants.DESC,
            priority: 1
          }
        }
      ]
    };

    that.group = {
      enableFiltering: true,
      enableColumnMenus: false,
      enableGridMenu: true,
      showGridFooter: true,
      onRegisterApi: function (gridApi) {
        that.vocabGridApi = gridApi;
      },
      columnDefs: [
        {field: 'tag', minWidth: 100, width: "*"},
        {field: 'item', displayName: "Item", minWidth: 100, width: "*", grouping: {groupPriority: 0},
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          }
        },
        {field: 'weight', displayName: "Weight", minWidth: 50, width: 100}
      ]
    };

  }]);
