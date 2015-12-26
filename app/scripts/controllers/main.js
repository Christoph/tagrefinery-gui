'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.thatroller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
   .controller('MainCtrl', function ($scope, $http, uiGridConstants) {
   var that = this;

   that.data = [];

      // hard-code data
      that.tempdata = [
        {name: 'Greg', score: 98},
        {name: 'Ari', score: 96},
        {name: 'Q', score: 75},
        {name: 'Loser', score: 48}
      ];

      that.addData = function() {
          that.tempdata.push({
              name: 'Added',
              score: 50
          });
          console.log(that.tempdata)
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

    $http.get('./../../data/data.json')
        .success(function(data) {
            that.data = data;
            that.overviewGrid.data = data;
            that.wordGrid.data = data;
        });

 });
