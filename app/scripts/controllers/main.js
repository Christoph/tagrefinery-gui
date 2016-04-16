'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.thatcontroller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('MainCtrl', ["$scope", "socket", "uiGridConstants", "intros", "$timeout", function ($scope, socket, uiGridConstants, intros, $timeout) {
    var that = this;

    that.intro = {
      overlayOpacity: 0.3,
      steps:[
        {
          intro: "<h3>Welcome! </h3><br>" +
          "If you need help in any of the pages start the introduction for the page by clicking <i class='fa fa-film'></i> in the right upper corner of the screen.",
          position: 'top-center'
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

    // State variables
    that.connectionStatus = false;
    that.dataLoaded = false;
    that.showImport = false;
    that.showWorkflow = false;
    that.dataChanged = false;
    that.running = false;
    that.loading = false;
    that.touched = false;
    that.mode = "";

    that.timer = $timeout(function() {
      $scope.introCurrent = that.intro;
    }, 1);

    $scope.state = intros.state;

    // Imported data
    $scope.dataI = [];

    $scope.$on("$destroy", function() {
      $timeout.cancel(that.timer);
    });

    ////////////////////////////////////////////////
    // Socket
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
        intros.set("running");
      }
    });

    socket.on('dataLoaded', function (data) {
      that.dataLoaded = data == "true";
      that.loading = false;
    });

    socket.on('selectedMode', function (data) {
      that.mode = data;
    });

    that.goToImport = function()
    {
      that.showImport = true;
      intros.set("import");
    };

    that.goToStart = function()
    {
      that.showWorkflow = false;
      that.showImport = false;
      if(that.running){
        intros.set("running");
      }
      else
      {
        intros.set("initial");
      }
    };

    that.reconnectToWorkflow = function()
    {
      that.showWorkflow = true;

      socket.emit("selectMode", "reconnect");
      intros.set("guided");
    };

    that.showLinkedView = function()
    {
      that.showWorkflow = true;

      socket.emit("selectMode", "linked");
    };

    that.showAdvancedView = function()
    {
      that.showWorkflow = true;
      that.running = true;

      socket.emit("selectMode", "free");
    };

    that.startWithDefaults = function()
    {
      that.showWorkflow = true;
      that.running = true;

      socket.emit("selectMode", "guided");
      intros.set("guided");
    };

    ////////////////////////////////////////////////
    // Import
    ////////////////////////////////////////////////

    that.import = function () {
      that.running = false;
      that.dataLoaded = false;
      that.loading = true;
      that.showImport = false;
      that.intro = that.initalIntro;

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
        {field: 'tag', minWidth: 100, width: "*", headerTooltip: "The tag itself composed of one or multiple words."},
        {field: 'item', minWidth: 100, width: "*", headerTooltip: "The item where the tag is attached to."},
        {field: 'weight', minWidth: 100, width: "*", headerTooltip: "The weight should be a positive number and allows you to use meta information corresponding to this tag/item pair. If no meta information is available, use 1 in all rows."}
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

    /*
    $scope.$watch("state", function(newVals) {
      if(newVals)
      {
        //noinspection JSUnresolvedVariable
        $scope.introCurrent = newVals.current;
      }
    },1);
    */

  }]);
