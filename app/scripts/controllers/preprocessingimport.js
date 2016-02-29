'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PreprocessingimportCtrl
 * @description
 * # PreprocessingimportCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PreprocessingimportCtrl', ["$scope", "socket", "uiGridConstants", function ($scope, socket, uiGridConstants) {

    // Get instance of the class
    var that = this;

    that.touched = false;

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('preDictionaryParams', function (data) {
      _.map(data, function (d) {
        $scope.data.push({word: d});
      })
    });

    that.apply = function () {
      socket.emit("applyPreImportedData", JSON.stringify($scope.data));

      that.touched = false;
    };

    that.undo = function()
    {
      $scope.data = [];

      that.touched = false;
    }

    ////////////////////////////////////////////////
    // Grid
    ////////////////////////////////////////////////

    // Grid
    $scope.data = [];
    $scope.gridOptions = {
      enableGridMenu: true,
      rowEditWaitInterval: -1,
      data: 'data',
      importerDataAddCallback: function (grid, newObjects) {
        $scope.data.length = 0;
        $scope.data = $scope.data.concat(newObjects);
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
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
