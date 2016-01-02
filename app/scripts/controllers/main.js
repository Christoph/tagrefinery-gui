'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.thatroller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
   .controller('MainCtrl', ["$scope", "httpLoader", "socket", "uiGridConstants", function ($scope, httpLoader, socket, uiGridConstants) {
   var that = this;

   that.data = [];
   that.history = [];

   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////
   socket.on('connect', function(data) {
       console.log("connected")
   });

   socket.on('data', function(data) {
       console.log("data:"+data)
   });

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

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                console.log(history)
                that.historyGrid.data = that.history;
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


   ////////////////////////////////////////////////
   // History Grid
   ////////////////////////////////////////////////
   
    that.historyGrid = {
        columnDefs: [
        { field: 'origin'},
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

    httpLoader('./../../data/data.json')
        .success(function(data) {
            that.data = data;
            that.overviewGrid.data = data;
        });

    httpLoader('./../../data/history.json')
        .success(function(data) {
            that.history = data;
        });

 }]);
