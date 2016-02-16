 'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:SpellcheckingfindCtrl
 * @description
 * # SpellcheckingfindCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('SpellcheckingfindCtrl', ["$scope", "socket", "uiGridConstants","$timeout","$uibModal", function ($scope, socket, uiGridConstants, $timeout, $uibModal) {

   var that = this;

   that.newSimilarity = 0;
   that.dataS = [];

   that.replacements = 0;
   that.newReplacements = 0;

   ////////////////////////////////////////////////
   // D3 functions
   ////////////////////////////////////////////////

    that.getNewSimilarity = function(threshold)
    { 
        $scope.$apply(function() {
            that.newSimilarity = threshold;

            //that.getReplacements();
        });
    };
    
    // This function needs decreasing sorted data from the server
    that.getAboveRow = function(data, threshold) {
        var index = 0;

        for(var i = 0; i<data.length; i++)
        {
            if(data[i].importance > threshold)
            {
                if((threshold - data[i].importance) <= (data[i-1].importance - threshold))
                {
                    return i;
                }
                else
                {
                    return i-1;
                }
            }
        }

        return index;
    }
    
   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////

   socket.on('spellSimilarity', function(data) {
       that.newSimilarity = parseFloat(data);
       //socket.emit("getReplacements", that.newSimilarity);
   });

   socket.on('replacements', function(data) {
       that.replGrid.data = JSON.parse(data);

       if(that.showDetails)
       {
   	       $timeout(function() {
           		that.scrollToR(0,0);
       		})
       }
   });

   socket.on('similarities', function(data) {
       that.dataS = JSON.parse(data);
   });

   that.apply = function()
   {
    	socket.emit("applySpellSimilarity",""+that.newSimilarity);
   };

   ////////////////////////////////////////////////
   // Replacement Grid
   ////////////////////////////////////////////////
   
    // Helper functions
    
    that.getReplacements = function()
    {
        //socket.emit("getReplacements", that.newSimilarity);
    };

    that.scrollToR = function( rowIndex, colIndex ) {
        that.replGridApi.core.scrollTo( that.replGrid.data[rowIndex], that.replGrid.columnDefs[colIndex]);
        that.replGridApi.selection.selectRow(that.replGrid.data[rowIndex]);
    };

    // Grid
    
    that.replGrid = {
        enableFiltering: false,
        enableColumnMenus: false,
        enableGridMenu: true,
        showGridFooter: false,
        fastWatch: true,
        multiSelect: false,
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        enableFullRowSelection: true,
        onRegisterApi: function(gridApi) {
            that.replGridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                that.newSimilarity = row.entity.similarity;
            });
        },
        columnDefs: [
        { field: 'truth', minWidth: 100, width: "*"}, 
        { field: 'replacement', minWidth: 100, width: "*"}, 
        { field: 'similarity', minWidth: 100, width: "*", cellFilter: 'number:6',
            sort: {
                direction: uiGridConstants.DESC,
                priority: 1
            }
        }
        ]
    };

   ////////////////////////////////////////////////
   // Helper
   ////////////////////////////////////////////////

   that.totalReplacements = function()
   {
       return _.sum(that.dataS, function(o) {
           return o.count;
       });
   };

   that.countNewReplacements = function()
   {
       return _.sum(_.filter(that.dataS, function(d) {
           return d.value >= that.newSimilarity;
       }), function(o) {
           return o.count;
       });
   };
    
  }]);
