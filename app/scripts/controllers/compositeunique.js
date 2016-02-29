'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:CompositeuniqueCtrl
 * @description
 * # CompositeuniqueCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('CompositeuniqueCtrl', ["$scope", "socket", "uiGridConstants", "$timeout", "$uibModal", function ($scope, socket, uiGridConstants, $timeout, $uibModal) {

    // Get instance of the class
    var that = this;


    that.touched = false;

    // Unique
    that.threshold = 0;;
    that.newThreshold = 0;
    that.data = [];

    ////////////////////////////////////////////////
    // D3 functions
    ////////////////////////////////////////////////

    that.getThreshold = function (threshold) {
      $scope.$apply(function () {
        that.newThreshold = threshold;

        if (that.showDetails) {
          $timeout(function () {
            that.scrollToU(that.getAboveRow(that.uniqueGrid.data, that.newThreshold), 0);
          })
        }

        that.touched = true;
      });
    };

    // This function needs decreasing sorted data from the server
    that.getAboveRow = function (data, threshold) {
      var index = 0;

      for (var i = 0; i < data.length; i++) {
        if (data[i].strength < threshold) {
          if ((threshold - data[i].strength) <= (data[i - 1].strength - threshold)) {
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

    socket.on('uniqueData', function (data) {
      that.data = JSON.parse(data);
    });

    socket.on('uniqueGroups', function (data) {
      that.uniqueGrid.data = JSON.parse(data);
    });

    socket.on('compUniqueParams', function (data) {
      that.newThreshold = parseFloat(data);
      that.threshold = that.newThreshold;
    });

    that.apply = function () {
      socket.emit("applyUniqueThreshold", "" + that.newThreshold);

      that.touched = false;
    };

    that.undo = function ()
    {
      that.newThreshold = that.threshold;

      that.touched = false;
    }

    ////////////////////////////////////////////////
    // Unique Grid
    ////////////////////////////////////////////////

    // Helper

    that.scrollToU = function (rowIndex, colIndex) {
      that.uniqueGridApi.core.scrollTo(that.uniqueGrid.data[rowIndex], that.uniqueGrid.columnDefs[colIndex]);
      that.uniqueGridApi.selection.selectRow(that.uniqueGrid.data[rowIndex]);
    };

    // Grid

    that.uniqueGrid = {
      enableFiltering: false,
      enableColumnMenus: false,
      enableGridMenu: true,
      showGridFooter: false,
      fastWatch: true,
      multiSelect: false,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      enableFullRowSelection: true,
      onRegisterApi: function (gridApi) {
        that.uniqueGridApi = gridApi;

        // Set unique threshold
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          that.newThreshold = row.entity.strength;
        });
      },
      columnDefs: [
        {field: 'group', minWidth: 100, width: "*"},
        {
          field: 'strength', minWidth: 100, width: "*", cellFilter: 'number:3',
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

    that.getGroups = function () {
      return _.sum(_.filter(that.data, function (d) {
        return d.value >= that.newThreshold;
      }), function (o) {
        return o.count;
      });
    }

  }]);
