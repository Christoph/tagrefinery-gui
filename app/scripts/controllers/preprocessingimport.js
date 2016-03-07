'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PreprocessingimportCtrl
 * @description
 * # PreprocessingimportCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PreprocessingimportCtrl', ["$scope", "socket", "uiGridConstants", "stats", function ($scope, socket, uiGridConstants, stats) {

    // Get instance of the class
    var that = this;

    that.touched = false;
    $scope.dataP = [];

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('preDictionaryParams', function (data) {
      $scope.dataP.length = 0;

      _.map(data, function (d) {
        $scope.dataP.push({word: d});
      });

      stats.writePre("Number of blacklisted Words", $scope.dataP.length);
    });

    $scope.$on("apply", function() {
      if(that.touched)
      {
        socket.emit("applyPreImportedData", JSON.stringify($scope.dataP));

        stats.writePre("Number of blacklisted Words", $scope.dataP.length);

        that.touched = false;
      }
    });

    that.clear = function()
    {
      $scope.dataP.length = 0;

      that.touched = true;
    };

    that.getFile = function(file)
    {
      $scope.$apply(function() {
        $scope.gridApi.importer.importFile( file );
        that.dataChanged = true;
      })
    };

    ////////////////////////////////////////////////
    // Grid
    ////////////////////////////////////////////////

    // Grid
    $scope.dataP = [];
    $scope.gridOptions = {
      enableGridMenu: false,
      showGridFooter: true,
      enableColumnMenus: false,
      enableFiltering: true,
      data: 'dataP',
      importerDataAddCallback: function (grid, newObjects) {
        $scope.dataP.length = 0;
        $scope.dataP = $scope.dataP.concat(newObjects);
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
        $scope.gridApi.core.refresh();
        that.touched = true;
      },
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
      },
      columnDefs: [
        {field: 'word', minWidth: 100, width: "*"}
      ]
    };

  }]);
