'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:CompositefrequentCtrl
 * @description
 * # CompositefrequentCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('CompositefrequentCtrl', ["$scope", "socket", "uiGridConstants", "$timeout", "stats", function ($scope, socket, uiGridConstants, $timeout, stats) {

    // Get instance of the class
    var that = this;

    that.touched = false;

    // Frequent
    that.threshold = 0;
    that.newThreshold = 0;
    that.data = [];

    that.replacements = 0;

    ////////////////////////////////////////////////
    // D3 functions
    ////////////////////////////////////////////////

    that.getThreshold = function (threshold) {
      $scope.$apply(function () {
        that.newThreshold = threshold;

        $timeout(function () {
          that.scrollToF(that.getAboveRow(that.frequentGrid.data, that.newThreshold), 0);
        });

        that.replacements = that.getGroups();
        stats.writeComp("Number of Frequent Groups", that.replacements);

        that.touched = true;

        that.applyDebounced();
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
    };

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('frequentData', function (data) {
      that.data = JSON.parse(data);

      that.replacements = that.getGroups();
      stats.writeComp("Number of Frequent Groups", that.replacements);
    });

    socket.on('frequentGroups', function (data) {
      that.frequentGrid.data = JSON.parse(data);
    });

    socket.on('compFrequentParams', function (data) {
      that.newThreshold = parseFloat(data);
      that.threshold = that.newThreshold;
    });

    that.applyWatch = $scope.$on("apply", function() {
      if(that.touched)
      {
        socket.emit("applyFrequentThreshold", "" + that.newThreshold);

        that.touched = false;
      }
    });

    that.applyDebounced = _.debounce(function() {
      socket.emit("applyFrequentThreshold", "" + that.newThreshold);
    }, 1000);

    that.noWatch = $scope.$on("noCompF", function() {
      if(that.newThreshold != 1.5)
      {
        that.newThreshold = 1.5;

        socket.emit("applyFrequentThreshold", "" + that.newThreshold);

        that.touched = false;
      }
    });

    that.defaultWatch = $scope.$on("dCompF", function() {
      if(that.newThreshold != 0.1)
      {
        that.newThreshold = 0.1;

        socket.emit("applyFrequentThreshold", "" + that.newThreshold);

        that.touched = false;
      }
    });

    that.undoWatch = $scope.$on("undo", function() {
      if(that.touched)
      {
        that.undo();
      }
    });

    $scope.$on('$destroy', function() {
      that.applyWatch();
      that.noWatch();
      that.defaultWatch();
      that.undoWatch();
    });

    that.undo = function ()
    {
      that.newThreshold = that.threshold;

      that.touched = false;
    };

    ////////////////////////////////////////////////
    // Frequent Grid
    ////////////////////////////////////////////////

    // Helper
    that.scrollToF = function (rowIndex, colIndex) {
      that.frequentGridApi.core.scrollTo(that.frequentGrid.data[rowIndex], that.frequentGrid.columnDefs[colIndex]);
      that.frequentGridApi.selection.selectRow(that.frequentGrid.data[rowIndex]);
    };

    // Grid
    var rowtemplate = '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'newItem\': grid.appScope.isCurrent( row ) }" ui-grid-cell></div>';

    $scope.isCurrent = function(row)
    {
      return row.entity.strength >= that.newThreshold;
    };

    that.frequentGrid = {
      rowTemplate: rowtemplate,
      enableFiltering: true,
      enableColumnMenus: false,
      enableGridMenu: true,
      showGridFooter: true,
      fastWatch: true,
      multiSelect: false,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      enableFullRowSelection: true,
      onRegisterApi: function (gridApi) {
        that.frequentGridApi = gridApi;

        // Set frequent threshold
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          that.newThreshold = row.entity.strength;
          that.replacements = that.getGroups();
        });
      },
      columnDefs: [
        {field: 'group', minWidth: 100, width: "*"},
        {field: 'strength',name: 'Group Strength', cellTemplate: 'views/cellStrength.html', width: 120, enableFiltering: false,
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
    };

  }]);
