'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
   .controller('MainCtrl', function ($http, uiGridConstants) {
   var cont = this;

    cont.overviewGrid = {
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

    cont.historyGrid = {
        columnDefs: [
        { field: 'Origin'},
        { field: 'Step 1'},
        { field: 'Step 2'},
        { field: 'Step 3'}
        ]
    };

    cont.wordGrid = {
        columnsDef: [
        { field: 'key' },
        { field: 'value', cellFilter: 'number:6' }
        ]
    }

    cont.simGrid = {
        columnDefs: [
        { field: 'Tag' },
        { field: 'Similarity' }
        ]
    }

    $http.get('./../../data/data.json')
        .success(function(data) {
            cont.overviewGrid.data = data;
            cont.wordGrid.data = data;
        });

 });
