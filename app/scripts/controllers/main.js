'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.thatcontroller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('MainCtrl', ["$scope", "socket", "uiGridConstants",  function ($scope, socket, uiGridConstants) {
    var that = this;

    that.connectionStatus = false;
    that.dataLoaded = false;
    that.showWorkflow = false;
    that.dataChanged = false;
    that.running = false;

    $scope.data = [];

    $scope.$parent.disconnected = true;

    socket.on('connect', function (data) {
      that.connectionStatus = true;
    });

    socket.on('isRunning', function (data) {
      if(data=="true") that.running = true;
      else that.running = false;
    });

    socket.on('disconnect', function (data) {
      that.connectionStatus = false;
    });

    socket.on('connect_error', function (data) {
      that.connectionStatus = false;
    });

    socket.on('mainData', function (data) {
      var json = JSON.parse(data);
      if (json.length > 0) {
        $scope.data = json;
        that.dataChanged = false;
        that.dataLoaded = true;
      }
    });

    that.reconnect = function () {
      socket.reconnect();
    };

    that.import = function () {
      if(that.dataChanged)
      {
          var chunk = 500;

          socket.emit("applyImportedDataCount", Math.ceil($scope.data.length / chunk));

          for (var i = 0, j = $scope.data.length; i < j; i += chunk) {
            socket.emit("applyImportedData", JSON.stringify(_.slice($scope.data, i, i + chunk)));
          }

          socket.emit("applyImportedDataFinished", "");
      }

      that.dataLoaded = true;
    };

    that.runAll = function() {
      socket.emit("runAll", "");
    }

    that.clear = function()
    {
      $scope.data.length = 0;
    }

    that.getFile = function(file)
    {
        $scope.$apply(function() {
          $scope.gridApi.importer.importFile( file );
          that.dataChanged = true;
        })
    }

    that.goToImport = function()
    {
      that.dataLoaded = false;
    }

    that.goToStart = function()
    {
      that.showWorkflow = false;
    }

    that.reconnectToWorkflow = function()
    {

      that.showWorkflow = true;
    }

    that.startWithDefaults = function()
    {

      that.showWorkflow = true;
    }

    that.startCustom = function()
    {

      that.showWorkflow = true;
    }

    // Grid
    $scope.gridOptions = {
      enableGridMenu: true,
      showGridFooter: true,
      enableColumnMenus: false,
      enableFiltering: true,
      data: 'data',
      importerDataAddCallback: function (grid, newObjects) {
        $scope.data = $scope.data.concat(newObjects);
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
        $scope.gridApi.core.refresh();
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
