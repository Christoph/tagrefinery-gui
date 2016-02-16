'use strict';
/* jshint -W117 */

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.thatroller:MainCtrl
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

   socket.on('connect', function(data) {
       	that.connectionStatus = true;

        if($scope.data.length > 0)
        {
          $scope.$parent.disconnected = false;
        }
   });

    socket.on('disconnect', function(data) {
       	that.connectionStatus = false;
       	$scope.$parent.disconnected = true;
       	$scope.$parent.activeTabs[0] = true;
   });

    socket.on('connect_error', function(data) {
       	that.connectionStatus = false;
       	$scope.$parent.disconnected = true;
       	$scope.$parent.activeTabs[0] = true;
   });

  socket.on('importedData', function(data) {
        that.connectionStatus = false;
        $scope.$parent.disconnected = true;
        $scope.$parent.activeTabs[0] = true;
   });

   that.reconnect = function() 
   {
       	socket.reconnect();
   };

   that.import = function() 
   {
      that.dataLoaded = true;

      socket.emit("applyImportedData",$scope.data);
   };

      // Grid
  $scope.data = [];
  $scope.gridOptions = {
    enableGridMenu: true,
    showGridFooter: true,
    enableColumnMenus: false,
    enableFiltering: true,
    rowEditWaitInterval: -1,
    data: 'data',
    importerDataAddCallback: function ( grid, newObjects ) {
      $scope.data = $scope.data.concat( newObjects );
      $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.ALL );
    },
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    }, 
    columnDefs: [
    { field: 'tag', minWidth: 100, width: "*"},
    { field: 'item', minWidth: 100, width: "*"},
    { field: 'weight', minWidth: 100, width: "*"}
    ]
  };

 }]);
