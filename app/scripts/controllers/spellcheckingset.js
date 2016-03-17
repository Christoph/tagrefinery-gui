'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:SpellcheckingsetCtrl
 * @description
 * # SpellcheckingsetCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('SpellcheckingsetCtrl', ["$scope", "socket", "uiGridConstants", "stats", function ($scope, socket, uiGridConstants, stats) {

    var that = this;

    that.importance = 0;
    that.newImportance = 0;
    that.similarity = 0;
    that.newSimilarity = 0;

    that.touched = false;

    that.data = [];
    that.domain = [0,1];

    that.replacements = 0;
    that.showReplacements = false;

    ////////////////////////////////////////////////
    // D3 functions
    ////////////////////////////////////////////////

    that.getNewImportance = function (threshold) {
      $scope.$apply(function () {
        that.newImportance = threshold;
        that.touched = true;
      });

      that.getReplacements();
    };

    that.slider = function (value) {
      $scope.$apply(function () {
        that.newSimilarity = value;
        that.touched = true;
      });

      if (that.showDetails) {
        that.simGridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
      }

      that.getReplacements();
    };

    // This function needs decreasing sorted data from the server
    that.getAboveRow = function (data, threshold) {
      var index = 0;

      for (var i = 0; i < data.length; i++) {
        console.log(data[i]);
        if (data[i].importance < threshold) {
          if ((threshold - data[i].importance) <= (data[i - 1].importance - threshold)) {
            return i;
          }
          else {
            return i - 1;
          }
        }
      }

      return index;
    };

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('spellImportance', function (data) {
      that.importance = parseFloat(data);
      that.newImportance = that.importance;
    });

    socket.on('spellSimilarity', function (data) {
      that.similarity = parseFloat(data);
      that.newSimilarity = that.similarity;
    });

    socket.on('vocab', function (data) {
      that.vocabGrid.data = JSON.parse(data);
    });

    socket.on('replacementData', function (data) {
      that.replGrid.data = JSON.parse(data);
    });

    socket.on('importance', function (data) {
      that.data = JSON.parse(data);
      that.getReplacements();
    });

    socket.on('replacements', function (data) {
      that.replacements = parseInt(data);

      stats.writeSpell("Number of Replacements", that.replacements);
    });

    socket.on('cluster', function (data) {
      var cluster = JSON.parse(data);

      if (cluster.length < 1) {
        cluster.push({tag: "No cluster", similarity: 0});
      }

      that.simGrid.data = cluster;
    });

    $scope.$on("apply", function() {
      if(that.touched)
      {
        that.similarity = that.newSimilarity;
        that.importance = that.newImportance;

        socket.emit("applySpellCorrect", JSON.stringify([{importance: that.newImportance, similarity: that.newSimilarity}]));

        if (that.showDetails) {
          that.simGridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
        }

        that.touched = false;

        that.getReplacements();
      }
    });

    $scope.$on("undo", function() {
      if(that.touched)
      {
        that.undo();
      }
    });

    $scope.$on("noSpellR", function() {
      if(!that.newSimilarity == 1.5 && !that.newImportance == 1.5) {
        that.newSimilarity = 1.5;
        that.newImportance = 1.5;

        socket.emit("applySpellCorrect", JSON.stringify([{
          importance: that.newImportance,
          similarity: that.newSimilarity
        }]));

        that.touched = false;

        that.getReplacements();
      }
    });

    $scope.$on("dSpellR", function() {
      if(!that.newSimilarity == 0.75 && !that.newImportance == 0.1)
      {
        that.newSimilarity = 0.75;
        that.newImportance = 0.1;

        socket.emit("applySpellCorrect", JSON.stringify([{importance: that.newImportance, similarity: that.newSimilarity}]));

        that.touched = false;

        that.getReplacements();
      }
    });

    that.undo = function()
    {
      that.newSimilarity = that.similarity;
      that.newImportance = that.importance;

      that.touched = false;

      that.getReplacements();
    };

    that.getReplacements = function()
    {
      socket.emit("getReplacements", JSON.stringify([{importance: that.newImportance, similarity: that.newSimilarity}]));

      if(that.showReplacements)
      {
        socket.emit("getReplacementData", JSON.stringify([{importance: that.newImportance, similarity: that.newSimilarity}]));
      }
    };

    that.show = function() {
      if (that.showReplacements)
      {
        socket.emit("getReplacementData", JSON.stringify([{importance: that.newImportance, similarity: that.newSimilarity}]));
        document.getElementById("spellCrepl").scrollIntoView()
      }
    };

    ////////////////////////////////////////////////
    // Vocab Grid
    ////////////////////////////////////////////////

    // Helper functions

    that.scrollToV = function (rowIndex, colIndex) {
      that.vocabGridApi.core.scrollTo(that.vocabGrid.data[rowIndex], that.vocabGrid.columnDefs[colIndex]);
      that.vocabGridApi.selection.selectRow(that.vocabGrid.data[rowIndex]);
    };

    that.getSimWords = function (tag) {
      socket.emit("getCluster", tag);
    };

    // Grid

    that.vocabGrid = {
      enableFiltering: true,
      showGridFooter: true,
      enableColumnMenus: false,
      enableGridMenu: true,
      fastWatch: true,
      multiSelect: false,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      enableFullRowSelection: true,
      onRegisterApi: function (gridApi) {
        that.vocabGridApi = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          that.getSimWords(row.entity.tag);
        });
      },
      columnDefs: [
        {field: 'tag', minWidth: 100, width: "*"},
        {
          field: 'importance', minWidth: 100, width: "*",
          sort: {
            direction: uiGridConstants.DESC,
            priority: 1
          },
          cellFilter: 'number:6', filters: [
          {
            condition: uiGridConstants.filter.GREATER_THAN,
            placeholder: 'greater than'
          },
          {
            condition: uiGridConstants.filter.LESS_THAN,
            placeholder: 'less than'
          }
        ]
        }
      ]
    };

    ////////////////////////////////////////////////
    // Similarity Grid
    ////////////////////////////////////////////////

    // Grid

    var rowtemplate = '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'current\': grid.appScope.isCurrent( row ), \'truth\': grid.appScope.isTruth( row ) }" ui-grid-cell></div>';

    $scope.isCurrent = function(row)
    {
      return row.entity.similarity >= that.newSimilarity && row.entity.importance < that.newImportance;
    };

    $scope.isTruth = function(row)
    {
      return row.entity.importance >= that.newImportance;
    };

    that.simGrid = {
      multiSelect: false,
      enableColumnMenus: false,
      enableFiltering: true,
      showGridFooter: true,
      enableGridMenu: true,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      enableFullRowSelection: true,
      rowTemplate:rowtemplate,
      onRegisterApi: function (gridApi) {
        that.simGridApi = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          if (row.entity.similarity > 0) {
            that.newSimilarity = row.entity.similarity;
          }

          // Tells the grid to redraw after click
          gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
        });
      },
      columnDefs: [
        {field: 'tag', minWidth: 100, width: "*"},
        {
          field: 'importance', minWidth: 100, width: "*",
          cellFilter: 'number:6', filters: [
          {
            condition: uiGridConstants.filter.GREATER_THAN,
            placeholder: 'greater than'
          },
          {
            condition: uiGridConstants.filter.LESS_THAN,
            placeholder: 'less than'
          }
          ]
        },
        {
          field: 'similarity', minWidth: 100, width: "*",
          sort: {
            direction: uiGridConstants.DESC,
            priority: 1
          },
          cellFilter: 'number:6', filters: [
          {
            condition: uiGridConstants.filter.GREATER_THAN,
            placeholder: 'greater than'
          },
          {
            condition: uiGridConstants.filter.LESS_THAN,
            placeholder: 'less than'
          }
        ]}]
    };

    ////////////////////////////////////////////////
    // Replacement Grid
    ////////////////////////////////////////////////

    // Grid

    that.replGrid = {
      multiSelect: false,
      enableColumnMenus: false,
      enableFiltering: true,
      showGridFooter: true,
      enableGridMenu: true,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      enableFullRowSelection: true,
      onRegisterApi: function (gridApi) {
        that.replGridApi = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {

        });
      },
      columnDefs: [
        {field: 'replacement', displayName: "Low Quality Word", minWidth: 100, width: "*"},
        {field: 'truth', displayName: "Replaced by higher quality word", minWidth: 100, width: "*"},
        {
          field: 'similarity', minWidth: 100, width: "*",
          sort: {
            direction: uiGridConstants.DESC,
            priority: 1
          },
          cellFilter: 'number:6', filters: [
          {
            condition: uiGridConstants.filter.GREATER_THAN,
            placeholder: 'greater than'
          },
          {
            condition: uiGridConstants.filter.LESS_THAN,
            placeholder: 'less than'
          }
        ]}]
    };

    that.openDetails = function()
    {
      if(that.showDetails) document.getElementById("spellCdetails").scrollIntoView()
    };

    that.countGroundTruth = function () {
      return _.sum(_.filter(that.data, function (d) {
        return d.value >= that.newImportance;
      }), function (o) {
        return o.count;
      });
    }

  }]);
