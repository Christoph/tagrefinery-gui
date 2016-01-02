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

   // Socket functions
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

    that.overviewGrid = {
        enableFiltering: true,
        showGridFooter: true,
        fastWatch: true,
        columnDefs: [
        { field: 'key'},
        { field: 'value', cellFilter: 'number:6', filters: [
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

    that.historyGrid = {
        columnDefs: [
        { field: 'Origin'},
        { field: 'Step 1'},
        { field: 'Step 2'},
        { field: 'Step 3'}
        ]
    };

    that.wordGrid = {
        multiSelect: false,
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        enableFullRowSelection: true,
        onRegisterApi: function(gridApi) {
            that.wordGroupApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                console.log('row changed'+row.entity.key);
            })
        },
        columnsDef: [
        { field: 'key' },
        { field: 'value', cellFilter: 'number:6' }
        ]
    };

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
            that.wordGrid.data = data;
        });

 }]);
