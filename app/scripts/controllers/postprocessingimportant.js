'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PostprocessingimportantCtrl
 * @description
 * # PostprocessingimportantCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PostprocessingimportantCtrl', ["$scope", "socket", "uiGridConstants", "$timeout", "stats", function ($scope, socket, uiGridConstants, $timeout, stats) {

    // Get instance of the class
    var that = this;

    that.touched = false;

    // Frequent
    that.threshold = 0;
    that.newThreshold = 0;
    that.data = [];

    that.count = 0;

    ////////////////////////////////////////////////
    // D3 functions
    ////////////////////////////////////////////////

    that.getThreshold = function (threshold) {
      $scope.$apply(function () {
        that.newThreshold = threshold;

        if (that.showDetails) {
          $timeout(function () {
            that.scrollTo(that.getAboveRow(that.grid.data, that.newThreshold), 0);
          })
        }

        that.count = that.newCount();
        stats.writePost("Number of Important Tags", that.count);

        that.touched = true;
      });
    };

    // This function needs decreasing sorted data from the server
    that.getAboveRow = function (data, threshold) {
      var index = 0;

      for (var i = 0; i < data.length; i++) {
        if (data[i].importance > threshold) {
          if ((threshold - data[i].importance) <= (data[i - 1].importance - threshold)) {
            return i;
          }
          else {
            return i - 1;
          }
        }
      }

      return index;
    }

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('postFilterData', function (data) {
      that.data = JSON.parse(data);

      that.count = that.newCount();
      stats.writePost("Number of Important Tags", that.count);
    });

    socket.on('postFilterGrid', function (data) {
      that.grid.data = JSON.parse(data);
    });

    socket.on('postFilterParams', function (data) {
      that.newThreshold = parseFloat(data);
      that.threshold = that.newThreshold;

      stats.writePost("Importance Threshold", Math.round(that.newThreshold * 1000) / 1000);
    });

    that.apply = function () {
      socket.emit("applyPostFilter", "" + that.newThreshold);

      stats.writePost("Importance Threshold", Math.round(that.newThreshold * 1000) / 1000);

      that.touched = false;
    };

    that.undo = function()
    {
      that.newThreshold = that.threshold;

      stats.writePost("Importance Threshold", Math.round(that.newThreshold * 1000) / 1000);

      that.touched = false;
    }

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
      enableFiltering: false,
      enableColumnMenus: false,
      enableGridMenu: true,
      showGridooter: false,
      fastWatch: true,
      multiSelect: false,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      enableullRowSelection: true,
      onRegisterApi: function (gridApi) {
        that.gridApi = gridApi;

        // Set frequent threshold
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          that.newThreshold = row.entity.importance;
        });
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

    ////////////////////////////////////////////////
    // Helper functions
    ////////////////////////////////////////////////

    that.newCount = function () {
      return _.sum(_.filter(that.data, function (d) {
        return d.value >= that.newThreshold;
      }), function (o) {
        return o.count;
      });
    }

  }]);
