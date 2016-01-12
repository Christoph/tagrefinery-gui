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

   $scope.history = {
       original: "asd",
       pre: "",
       composite: "",
       post: ""
   };

   $scope.templateUrl = 'popoverTemplateInline.html';

   // tabindex="0" makes the popover use focus as trigger
   that.popover = '<div tabindex="0" popover-append-to-body="true" class="ui-grid-cell-contents" popover-placement="left" uib-popover="asdasd" popover-trigger="focus">{{row.entity.tag}}</div>';

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

       $scope.history = JSON.parse(data);
   });

   socket.on('overview', function(data) {
       that.overviewGrid.data = JSON.parse(data);
   });

   ////////////////////////////////////////////////
   // Overview Grid
   ////////////////////////////////////////////////
   
   that.overviewGrid = {
        enableFiltering: true,
        multiSelect: false,
        enableRowHeaderSelection: false,
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
        { field: 'tag', cellTemplate: that.popover, cellClass: 'cellPopover', minWidth: 100},
        { field: 'carrier', minWidth: 100, width: "*"},
        { field: 'importance', minWidth: 100, width: "*", cellFilter: 'number:6', filters: [
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

    $scope.grid = {
        columnDefs: [
        { field: 'original'},
        { field: 'pre'},
        { field: 'composite'},
        { field: 'post'}
        ]
    };


 }]);
