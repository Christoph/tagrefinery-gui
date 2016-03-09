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
    that.touched = false;

    that.helper = true;

    // Imported data
    $scope.dataI = [];

    ////////////////////////////////////////////////
    // Start
    ////////////////////////////////////////////////

    socket.on('mainData', function (data) {
      var json = JSON.parse(data);
      if (json.length > 0) {
        $scope.dataI = json;
        that.dataChanged = false;
        that.dataLoaded = true;
      }
    });

    socket.on('isRunning', function (data) {
      that.running = data == "true";
    });

    socket.on('dataLoaded', function (data) {
      that.dataLoaded = data == "true";
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

      socket.emit("selectMode", "reconnect");
    };

    that.startWithDefaults = function()
    {
      that.showWorkflow = true;

      socket.emit("selectMode", "guided");
    };

    that.startCustom = function()
    {
      that.showWorkflow = true;

      socket.emit("selectMode", "free");
    };

    ////////////////////////////////////////////////
    // Import
    ////////////////////////////////////////////////

    that.import = function () {
      that.running = false;
      that.dataLoaded = false;
      that.loading = true;
      that.showImport = false;

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

        that.touched = true;
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
    };

    ////////////////////////////////////////////////
    // Global
    ////////////////////////////////////////////////

    socket.on('connect', function () {
      that.connectionStatus = true;
    });

    socket.on('disconnect', function () {
      // Reset all states
      that.connectionStatus = false;
      that.dataLoaded = false;
      that.showImport = false;
      that.showWorkflow = false;
      that.dataChanged = false;
      that.running = false;
      that.loading = false;
      that.touched = false;

      $scope.dataI.length = 0;
    });

    socket.on('connect_error', function () {
      // Reset all states
      that.connectionStatus = false;
      that.dataLoaded = false;
      that.showImport = false;
      that.showWorkflow = false;
      that.dataChanged = false;
      that.running = false;
      that.loading = false;
      that.touched = false;

      $scope.dataI.length = 0;
    });

    ////////////////////////////////////////////////
    // Guide
    ////////////////////////////////////////////////

    $scope.IntroOptions = {
      overlayOpacity: 0.3,
      steps:[
        {
          element: '#start1',
          intro: "Import your csv file ...",
          position: 'top'
        },
        {
          element: '#start2',
          intro: "... and tidy up your tags!",
          position: 'bottom-middle-aligned'
        },
        {
          element: '#start3',
          intro: "Restart the introduction by clicking on the small <i class='fa fa-info'></i> in the right upper corner.",
          position: 'left'
        }
      ],
      showStepNumbers: false,
      showBullets: true,
      exitOnOverlayClick: true,
      exitOnEsc: true,
      nextLabel: '<strong>Next</strong>',
      prevLabel: 'Previous',
      skipLabel: 'Exit',
      doneLabel: 'Done'
    };

    $scope.ExitEvent = function () {
      that.helper = false;
    };

    $scope.CompletedEvent = function () {
      that.helper = false;
    };

  }]);
