'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.thatcontroller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('MainCtrl', ["$scope", "socket", "uiGridConstants", function ($scope, socket, uiGridConstants) {
    var that = this;

    that.connectionStatus = false;
    that.dataLoaded = false;

    $scope.$parent.disconnected = true;

    socket.on('connect', function (data) {
      that.connectionStatus = true;

      if ($scope.data.length > 0) {
        $scope.$parent.disconnected = false;
      }
    });

    socket.on('disconnect', function (data) {
      that.connectionStatus = false;
      $scope.$parent.disconnected = true;
      $scope.$parent.activeTabs[0] = true;
    });

    socket.on('connect_error', function (data) {
      that.connectionStatus = false;
      $scope.$parent.disconnected = true;
      $scope.$parent.activeTabs[0] = true;
    });

    socket.on('mainData', function (data) {
      var json = JSON.parse(data);
      if (json.length > 0) {
        $scope.gridOptions.data = json;
        that.dataLoaded = true;
        $scope.$parent.disconnected = false;
      }
    });

    that.reconnect = function () {
      socket.reconnect();
    };

    that.import = function () {
      var chunk = 500;

      socket.emit("applyImportedDataCount", Math.ceil($scope.data.length / chunk));

      for (var i = 0, j = $scope.data.length; i < j; i += chunk) {
        socket.emit("applyImportedData", JSON.stringify(_.slice($scope.data, i, i + chunk)));
      }

      socket.emit("applyImportedDataFinished", "");
      that.dataLoaded = true;
      $scope.$parent.disconnected = false;
    };

    that.runAll = function() {
      socket.emit("runAll", "");
    }

    // Grid
    $scope.data = [];
    $scope.gridOptions = {
      enableGridMenu: true,
      showGridFooter: true,
      enableColumnMenus: false,
      enableFiltering: true,
      rowEditWaitInterval: -1,
      data: 'data',
      importerDataAddCallback: function (grid, newObjects) {
        $scope.data = $scope.data.concat(newObjects);
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
      },
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
      },
      columnDefs: [
        {field: 'tag', minWidth: 100, width: "*"},
        {field: 'item', minWidth: 100, width: "*"},
        {field: 'weight', minWidth: 100, width: "*"}
      ]
    };

  }]);
