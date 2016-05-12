'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.thatcontroller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('ImportCtrl', ["$scope", "socket", "uiGridConstants", "initialData", function ($scope, socket, uiGridConstants, initialData) {
    var that = this;

    // Get resolved data
    $scope.dataI = JSON.parse(initialData.StartImportData);
    that.dataLoaded = initialData.Loaded;

    // State variables
    that.dataChanged = false;
    that.touched = false;

    // Cleanup
    $scope.$on("$destroy", function() {
      console.log("import destroy")

      $scope.dataI.length = 0;
    });

    ////////////////////////////////////////////////
    // Import
    ////////////////////////////////////////////////

    that.import = function () {
      that.dataLoaded = false;

      if(that.dataChanged)
      {
        var chunk = 500;

        socket.emit("applyImportedDataCount", Math.ceil($scope.dataI.length / chunk));

        for (var i = 0, j = $scope.dataI.length; i < j; i += chunk) {
          socket.emit("applyImportedData", JSON.stringify(_.slice($scope.dataI, i, i + chunk)));
        }

        socket.emit("applyImportedDataFinished", "");
      }

      that.touched = false;
    };

    that.clear = function()
    {
      $scope.dataI.length = 0;
    };

    that.getFile = function(file)
    {
      $scope.$apply(function() {
        $scope.gridApi.importer.importFile( file );
        that.dataChanged = true;
      })
    };

    // Grid
    $scope.gridOptions = {
      enableGridMenu: false,
      showGridFooter: true,
      enableColumnMenus: false,
      enableFiltering: true,
      data: 'dataI',
      importerDataAddCallback: function (grid, newObjects) {
        $scope.dataI = $scope.dataI.concat(newObjects);
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
        $scope.gridApi.core.refresh();

        console.log($scope.dataI.length)
        that.touched = true;
      },
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
      },
      columnDefs: [
        {field: 'tag', minWidth: 100, width: "*", headerTooltip: "The tag itself composed of one or multiple words."},
        {field: 'item', minWidth: 100, width: "*", headerTooltip: "The item where the tag is attached to."},
        {field: 'weight', minWidth: 100, width: "*", headerTooltip: "The weight should be a positive number and allows you to use meta information corresponding to this tag/item pair. If no meta information is available, use 1 in all rows."}
      ]
    };

  }]);
