'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PostprocessingsalvageCtrl
 * @description
 * # PostprocessingsalvageCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PostprocessingsalvageCtrl', ["$scope", "socket", "uiGridConstants","$timeout","$q", function ($scope, socket, uiGridConstants, $timeout, $q) {

    // Get instance of the class
    var that = this;

	that.temp = [];
    that.replace = [];
    that.old;
    that.changes = false;

    that.remove = function(index)
    {
    	that.replace.splice(index,1);
    }
   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////

   socket.on('importantWords', function(data) {
       that.grid.data = JSON.parse(data);
       that.temp = JSON.parse(data); 
   });

   that.apply = function() 
   {
       socket.emit("applySalvaging",that.replace);
   };

	socket.emit("getPostprocessingData","importantWords");

   ////////////////////////////////////////////////
   // Grid
   ////////////////////////////////////////////////

    // Grid

   that.grid = {
        enableFiltering: true,
        enableColumnMenus: false,
        multiSelect: false,
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        enableullRowSelection: true,
        enableGridMenu: true,
        onRegisterApi: function(gridApi) {
            that.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                that.deleteRow(row);
                that.changes = true;
            });
        }, 
        columnDefs: [
        { field: 'tag', minWidth: 100, width: "*"}
        ]
    };

	that.deleteRow = function(row) {
		var index = that.grid.data.indexOf(row.entity);
		that.grid.data.splice(index, 1);
	};

	that.revert = function()
	{
		that.changes = false;

		that.grid.data = _.clone(that.temp);
	}

   ////////////////////////////////////////////////
   // Salvaging
   ////////////////////////////////////////////////

    // Grid

   that.salvage = {
        enableFiltering: true,
        enableColumnMenus: false,
        multiSelect: false,
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        enableullRowSelection: true,
        enableGridMenu: true,
        onRegisterApi: function(gridApi) {
            that.salvageGridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                
            });
        }, 
        columnDefs: [
        { field: 'important', displayName: 'Important Tag', minWidth: 100, width: "*"},
        { field: 'original', displayName: 'Unimportant Tag', minWidth: 100, width: "*"},
        { field: 'salvage', displayName: 'Salvage', minWidth: 100, width: "*"}
        ]
    };

  }]);