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

    // State variables
    that.connectionStatus = false;
    that.dataLoaded = false;
    that.showImport = false;
    that.showWorkflow = false;
    that.dataChanged = false;
    that.running = false;
    that.loading = false;

    // Imported data
    $scope.data = [];

    ////////////////////////////////////////////////
    // Start
    ////////////////////////////////////////////////

    socket.on('mainData', function (data) {
      var json = JSON.parse(data);
      if (json.length > 0) {
        $scope.data = json;
        that.dataChanged = false;
        that.dataLoaded = true;
      }
    });

    socket.on('isRunning', function (data) {
      that.running = data == "true";
    });

    socket.on('dataLoaded', function () {
      that.dataLoaded = true;
      that.loading = false;
    });

    that.goToImport = function()
    {
      that.showImport = true;
    };

    that.goToStart = function()
    {
      that.showWorkflow = false;
      that.showImport = false;
    };

    that.reconnectToWorkflow = function()
    {
      that.showWorkflow = true;
    };

    that.startWithDefaults = function()
    {
      socket.emit("runAll", "default");

      that.showWorkflow = true;
    };

    that.startCustom = function()
    {
      socket.emit("runAll", "custom");

      that.showWorkflow = true;
    };

    ////////////////////////////////////////////////
    // Import
    ////////////////////////////////////////////////

    that.import = function () {
      that.showImport = false;

      if(that.dataChanged)
      {
        var chunk = 500;

        socket.emit("applyImportedDataCount", Math.ceil($scope.data.length / chunk));

        for (var i = 0, j = $scope.data.length; i < j; i += chunk) {
          socket.emit("applyImportedData", JSON.stringify(_.slice($scope.data, i, i + chunk)));
        }

        socket.emit("applyImportedDataFinished", "");
      }

      that.loading = true;
      that.showImport = false;
    };

    that.clear = function()
    {
      $scope.data.length = 0;
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

    ////////////////////////////////////////////////
    // Disconnect
    ////////////////////////////////////////////////

    that.reconnect = function () {
      socket.reconnect();

      // Reset all states
      that.connectionStatus = false;
      that.dataLoaded = false;
      that.showImport = false;
      that.showWorkflow = false;
      that.dataChanged = false;
      that.running = false;

      $scope.data.length = 0;
    };

    ////////////////////////////////////////////////
    // Global
    ////////////////////////////////////////////////

    socket.on('connect', function () {
      that.connectionStatus = true;
    });

    socket.on('disconnect', function () {
      that.connectionStatus = false;
    });

    socket.on('connect_error', function () {
      that.connectionStatus = false;
    });

  }]);
