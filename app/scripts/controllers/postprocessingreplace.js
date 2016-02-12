'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PostprocessingreplaceCtrl
 * @description
 * # PostprocessingreplaceCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PostprocessingreplaceCtrl', ["$scope", "socket", "uiGridConstants","$timeout","$q", function ($scope, socket, uiGridConstants, $timeout, $q) {

    // Get instance of the class
    var that = this;

    that.replace = [];
    that.old;
    

    that.remove = function(index)
    {
    	that.replace.splice(index,1);
    }
   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////

   socket.on('importantWords', function(data) {
       that.grid.data = JSON.parse(data);
   });

   that.apply = function() 
   {
       socket.emit("applyImportantReplacements",that.replace);
   };

    // I accordian gets opened => initialize
	if($scope.$parent.status.open[1] == true)
	{
		socket.emit("getPostprocessingData","importantWords");
	}

   ////////////////////////////////////////////////
   // Grid
   ////////////////////////////////////////////////


    that.saveRow = function( rowEntity ) {
	    var promise = $q.defer();
	    that.gridApi.rowEdit.setSavePromise( rowEntity, promise.promise );
	 
	 	that.replace.push({replace: that.old, by:rowEntity.tag});	

	 	promise.resolve();
  	};

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
                that.old = row.entity.tag;
            });

            gridApi.rowEdit.on.saveRow($scope, that.saveRow);
        }, 
        columnDefs: [
        { field: 'tag', minWidth: 100, width: "*"}
        ]
    };



  }]);