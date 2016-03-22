'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PreprocessingfilterCtrl
 * @description
 * # PreprocessingfilterCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PreprocessingfilterCtrl', ["$scope", "socket", "uiGridConstants", "$timeout", "stats", function ($scope, socket, uiGridConstants, $timeout, stats) {

    // Get instance of the class
    var that = this;

    that.touched = false;
    that.showDetails = false;

    // Frequent
    that.occurrences = 0;
    that.newOccurrences = 0;
    that.data = [];

    that.filteredWords = 0;

    ////////////////////////////////////////////////
    // D3 functions
    ////////////////////////////////////////////////

    that.getOccurrences = function (occurrences) {
      $scope.$apply(function () {
        that.newOccurrences = occurrences;

        if (that.showDetails) {
          $timeout(function () {
            that.scrollTo(that.getAboveRow(that.grid.data, that.newOccurrences), 0);
          })
        }

        stats.writePre("Number of Filtered Words", that.newCount());

        that.touched = true;
      });
    };

    // This function needs decreasing sorted data from the server
    that.getAboveRow = function (data, occurrences) {
      var index = data.length;

      for (var i = 0; i < data.length; i++) {
        if (data[i].occurrence < occurrences) {
          if ((occurrences - data[i].occurrence) <= (data[i - 1].occurrence - occurrences)) {
            return i;
          }
          else {
            return i - 1;
          }
        }
      }

      return index;
    };

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('preFilterData', function (data) {
      that.data = JSON.parse(data);

      stats.writePre("Number of Filtered Words", that.newCount());
    });

    socket.on('preFilterGrid', function (data) {
      that.grid.data = JSON.parse(data);
    });

    socket.on('preFilterParams', function (data) {
      that.occurrences = parseFloat(data);
      that.newOccurrences = that.occurrences;

      stats.writePre("Occurrence threshold", that.newOccurrences);
    });

    $scope.$on("apply", function() {
      if(that.touched)
      {
        socket.emit("applyPrefilter", "" + that.newOccurrences);
        that.occurrences = that.newOccurrences;

        stats.writePre("Occurrence threshold", that.newOccurrences);

        that.touched = false;
      }
    });

    $scope.$on("noPreF", function() {
      if(that.newOccurrences != 0)
      {
        that.newOccurrences = 0;

        socket.emit("applyPrefilter", "" + that.newOccurrences);
        that.occurrences = that.newOccurrences;

        stats.writePre("Occurrence threshold", that.newOccurrences);

        that.touched = false;
      }
    });

    $scope.$on("dPreF", function() {
      if(that.newOccurrences != 0) {
        that.newOccurrences = 0;

        socket.emit("applyPrefilter", "" + that.newOccurrences);
        that.occurrences = that.newOccurrences;

        stats.writePre("Occurrence threshold", that.newOccurrences);

        that.touched = false;
      }
    });

    $scope.$on("undo", function() {
      if(that.touched)
      {
        that.undo();
      }
    });

    that.undo = function()
    {
      that.newOccurrences = that.occurrences;

      stats.writePre("Occurrence threshold", that.newOccurrences);

      that.touched = false;
    };

    ////////////////////////////////////////////////
    // requent Grid
    ////////////////////////////////////////////////

    // Helper
    that.scrollTo = function (rowIndex, colIndex) {
      that.gridApi.core.scrollTo(that.grid.data[rowIndex], that.grid.columnDefs[colIndex]);
      that.gridApi.selection.selectRow(that.grid.data[rowIndex]);
      that.gridApi.selection.uns
    };

    // Grid
    var rowtemplate = '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'removedItem\': grid.appScope.isRemoved( row ) }" ui-grid-cell></div>';

    $scope.isRemoved = function(row)
    {
      return row.entity.occurrence <= that.newOccurrences;
    };

    that.grid = {
      rowTemplate: rowtemplate,
      enableFiltering: true,
      enableColumnMenus: false,
      enableGridMenu: true,
      showGridFooter: false,
      fastWatch: true,
      multiSelect: false,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      onRegisterApi: function (gridApi) {
        that.gridApi = gridApi;

        // Set frequent occurrences
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          that.newOccurrences = row.entity.occurrence;

          // Tells the grid to redraw after click
          gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
        });
      },
      columnDefs: [
        {field: 'tag', minWidth: 100, width: "*"},
        {
          field: 'occurrence', displayName: "Occurrences", minWidth: 100, width: "*",
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          }
        }
      ]
    };

    ////////////////////////////////////////////////
    // Helper functions
    ////////////////////////////////////////////////

    that.openGrid = function()
    {
      if(that.showDetails) document.getElementById("preFscroll").scrollIntoView()

      $timeout(function () {
        that.scrollTo(that.getAboveRow(that.grid.data, that.newOccurrences), 0);
      })
    };

    that.newCount = function () {
      return _.sum(that.data, function(d) { return d.count; }) - _.sum(_.filter(that.data, function (d) {
        return d.value > that.newOccurrences;
      }), function (o) {
        return o.count;
      });

    };

  }]);
