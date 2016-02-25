'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:SpellcheckingimportCtrl
 * @description
 * # SpellcheckingimportCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('SpellcheckingimportCtrl', ["$scope", "socket", "uiGridConstants", function ($scope, socket, uiGridConstants) {

    // Get instance of the class
    var that = this;

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('spellDictionaryParams', function (data) {
      _.map(data, function (d) {
        $scope.data.push({tag: d});
      })
    });

    that.apply = function () {
      socket.emit("applySpellImportedData", JSON.stringify($scope.data));
    };

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
      },
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
      },
      columnDefs: [
        {field: 'tag', minWidth: 100, width: "*"}
      ]
    };

  }]);
