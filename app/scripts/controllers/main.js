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

   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////
   socket.on('connect', function() {
       console.log("connected");
   });

   socket.on('initalized', function(data) {
       that.overviewGrid.data = JSON.parse(data);
       console.log("initialized");
   });

   socket.on('history', function(data) {
       that.historyGrid.data = JSON.parse(data);
   });

   socket.on('overview', function(data) {
       that.overviewGrid.data = JSON.parse(data);
   });

   ////////////////////////////////////////////////
   // Overview Grid
   ////////////////////////////////////////////////
   
   that.overviewGrid = {
        enableFiltering: true,
        showGridFooter: true,
        fastWatch: true,
        enableFullRowSelection: true,
        onRegisterApi: function(gridApi) {
            that.overviewGridApi = gridApi;

            // Update History grid
            gridApi.selection.on.rowSelectionChanged($scope, function() {
                getHistory(gridApi.selection.getSelectedGridRows());
            });
        }, 
        columnDefs: [
        { field: 'tag'},
        { field: 'carrier'},
        { field: 'importance', cellFilter: 'number:6', filters: [
            {
              condition: uiGridConstants.filter.GREATER_THAN,
              placeholder: 'greater than'
            },
            {
              condition: uiGridConstants.filter.LESS_THAN,
              placeholder: 'less than'
            }
        ]}
        ]
    };

   // Helper functions
   
   // Update History grid
   function getHistory(gridList)
   {
       var ids = [];

       ids = _.map(_.map(gridList, 'entity'),'id');
        
       socket.emit("getHistory",ids.join());
   }

   ////////////////////////////////////////////////
   // History Grid
   ////////////////////////////////////////////////
   
    that.historyGrid = {
        columnDefs: [
        { field: 'original'},
        { field: 'pre'},
        { field: 'composite'},
        { field: 'post'}
        ]
    };

 }]);
