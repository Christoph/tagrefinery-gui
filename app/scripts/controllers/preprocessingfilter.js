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

        that.filteredWords = that.newCount();
        stats.writePre("Number of Remaining Words", that.filteredWords);

        that.touched = true;
      });
    };

    // This function needs decreasing sorted data from the server
    that.getAboveRow = function (data, occurrences) {
      var index = 0;

      for (var i = 0; i < data.length; i++) {
        if (data[i].importance > occurrences) {
          if ((occurrences - data[i].importance) <= (data[i - 1].importance - occurrences)) {
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

      that.filteredWords = that.newCount();
      stats.writePre("Number of Filtered Words", that.filteredWords);
    });

    socket.on('preFilterGrid', function (data) {
      that.grid.data = JSON.parse(data);
    });

    socket.on('preFilterParams', function (data) {
      that.occurrences = parseFloat(data);
      that.newOccurrences = that.occurrences;

      stats.writePre("Minimum Occurrence", that.newOccurrences);
    });

    $scope.$on("apply", function() {
      if(that.touched)
      {
        socket.emit("applyPrefilter", "" + that.newOccurrences);
        that.occurrences = that.newOccurrences;

        stats.writePre("Minimum Occurrence", that.newOccurrences);

        that.touched = false;
      }
    });

    that.undo = function()
    {
      that.newOccurrences = that.occurrences;

      stats.writePre("Minimum Occurrence", that.newOccurrences);

      that.touched = false;
    };

    ////////////////////////////////////////////////
    // requent Grid
    ////////////////////////////////////////////////

    // Helper
    that.scrollTo = function (rowIndex, colIndex) {
      that.gridApi.core.scrollTo(that.grid.data[rowIndex], that.grid.columnDefs[colIndex]);
      that.gridApi.selection.selectRow(that.grid.data[rowIndex]);
    };

    // Grid

    that.grid = {
      enableFiltering: true,
      enableColumnMenus: false,
      enableGridMenu: true,
      showGridooter: false,
      fastWatch: true,
      multiSelect: false,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      onRegisterApi: function (gridApi) {
        that.gridApi = gridApi;

        // Set frequent occurrences
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          that.newOccurrences = row.entity.importance;
        });
      },
      columnDefs: [
        {field: 'tag', minWidth: 100, width: "*"},
        {
          field: 'importance', displayName: "Occurrences", minWidth: 100, width: "*",
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

    that.newCount = function () {
      return _.sum(that.data, function(d) { return d.count; }) - _.sum(_.filter(that.data, function (d) {
        return d.value < that.newOccurrences;
      }), function (o) {
        return o.count;
      });

    }

  }]);
