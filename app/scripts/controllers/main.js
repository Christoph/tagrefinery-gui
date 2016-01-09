'use strict';

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

   that.overview = [];
   that.history = [];

   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////
   socket.on('connect', function(data) {
       console.log("connected")
   });

   socket.on('initalized', function(data) {
       that.overviewGrid.data = JSON.parse(data);
       console.log("initialized");
   });

   socket.on('history', function(data) {
       that.historyGrid.data = JSON.parse(data);
   });

   ////////////////////////////////////////////////
   // D3 functions
   ////////////////////////////////////////////////

      // hard-code data
      that.tempdata = [
        {name: 'Greg', score: 98},
        {name: 'Ari', score: 96},
        {name: 'Q', score: 75},
        {name: 'Loser', score: 48}
      ];

      that.addData = function() {
          socket.emit("initialize","test")
          that.tempdata.push({
              name: 'Added',
              score: 50
          });
      };

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
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                getHistory(gridApi.selection.getSelectedGridRows())
            })
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


   ////////////////////////////////////////////////
   // Word Grid
   ////////////////////////////////////////////////
   
    that.wordGrid = {
        multiSelect: false,
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        enableFullRowSelection: true,
        onRegisterApi: function(gridApi) {
            that.wordGroupApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                console.log('row changed'+row.entity[0]);
            })
        },
        columnsDef: [
        { field: 'key' },
        { field: 'value', cellFilter: 'number:6' }
        ]
    };


   ////////////////////////////////////////////////
   // Similarity Grid
   ////////////////////////////////////////////////
   
    that.simGrid = {
        columnDefs: [
        { field: 'Tag' },
        { field: 'Similarity' }
        ]
    };

 }]);
