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

      if(that.running == true)
      {
        that.helper = false;
        that.intro = that.updateHelper;
      }
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

    that.showLinkedView = function()
    {
      that.showWorkflow = true;

      socket.emit("selectMode", "linked");
    };

    that.showAdvancedView = function()
    {
      that.showWorkflow = true;

      socket.emit("selectMode", "free");
    };

    that.startWithDefaults = function()
    {
      that.showWorkflow = true;

      socket.emit("selectMode", "guided");
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

    that.startHelper = {
      overlayOpacity: 0.3,
      steps:[
        {
          element: '#start1',
          intro: "Import your csv file.",
          position: 'top'
        },
        {
          element: '#start2',
          intro: "The guided Mode provides default values and guides you through the process.",
          position: 'top'
        },
        {
          element: '#start3',
          intro: "The advanced mode provides additional parameters and options but is unguided.",
          position: 'top'
        },
        {
          element: '#start4',
          intro: "In each screen just click onto the small <i class='fa fa-film'></i> to show the introduction.",
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

    that.intro = that.startHelper;

    that.updateHelper = {
      overlayOpacity: 0.3,
      steps:[
        {
          element: '#update1',
          intro: "Reconnect to the current Season.",
          position: 'top'
        },
        {
          element: '#update2',
          intro: "Update your data here.",
          position: 'top'
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

    that.ExitEvent = function () {
      that.helper = false;
    };

    that.CompletedEvent = function () {
      that.helper = false;
    };

    that.introImport = {
      overlayOpacity: 0.3,
      steps:[
        {
          element: '#import1',
          intro: "Upload a csv file or add another file.",
          position: 'top'
        },
        {
          element: '#import2',
          intro: "Review the uploaded data.",
          position: 'top'
        },
        {
          element: '#import3',
          intro: '<span class="fa fa-trash"></span> Clear or <span class="fa fa-floppy-o"></span> Save the uploaded data.',
          position: 'top'
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

    that.ExitEvent = function () {
      that.helper = false;
    };

    that.CompletedEvent = function () {
      that.helper = false;
    };

  }]);
