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
    
   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////

   that.apply = function() 
   {
       socket.emit("applyImportedData", JSON.stringify($scope.data));
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
    importerDataAddCallback: function ( grid, newObjects ) {
      $scope.data = $scope.data.concat( newObjects );
    },
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    }, 
    columnDefs: [
    { field: 'tag', minWidth: 100, width: "*"}
    ]
  };

  }]);
