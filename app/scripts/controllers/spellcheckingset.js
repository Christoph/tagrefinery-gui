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

    that.twentyfive = false;
    that.zero = false;

    ////////////////////////////////////////////////
    // D3 functions
    ////////////////////////////////////////////////

    that.getNewImportance = function (threshold) {
      $scope.$apply(function () {
        that.newImportance = threshold;
        that.touched = true;
      });

      stats.writeSpell("Number of Replacements", that.getReplacementCount());
      stats.writeSpell("Number of Additional Ground Truth Words", that.countGroundTruth());
    };

    that.slider = function (value) {
      $scope.$apply(function () {
        that.newSimilarity = value;
        that.touched = true;
      });

      that.scrollToR(that.getAboveRow(that.replGrid.data, that.newSimilarity),0);

      if(that.newSimilarity < 0.5 && !that.twentyfive)
      {
        that.getReplacements(0.25);
        that.twentyfive = true;
      }

      if(that.newSimilarity < 0.25 && !that.zero)
      {
        that.getReplacements(0);
        that.zero = true;
      }

      stats.writeSpell("Number of Replacements", that.getReplacementCount());
    };

    // This function needs decreasing sorted data from the server
    that.getAboveRow = function (data, threshold) {
      var index = 0;

      for (var i = 0; i < data.length; i++) {
        if (data[i].similarity <= threshold) {
          if ((threshold - data[i].similarity) <= (data[i - 1].similarity - threshold)) {
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

    socket.on('replacementData', function (data) {
      that.replGrid.data = JSON.parse(data);

      stats.writeSpell("Number of Replacements", that.getReplacementCount());
      stats.writeSpell("Number of Additional Ground Truth Words", that.countGroundTruth());
    });

    that.getReplacements = function(sim)
    {
      socket.emit("getReplacements", sim);
    };

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

        stats.writeSpell("Number of Replacements", that.getReplacementCount());
        stats.writeSpell("Number of Additional Ground Truth Words", that.countGroundTruth());
      }
    });

    $scope.$on("undo", function() {
      if(that.touched)
      {
        that.undo();
      }
    });

    $scope.$on("noSpellR", function() {
      if(that.newSimilarity != 1 || that.newImportance != 1) {
        that.newSimilarity = 1;
        that.newImportance = 1;

        socket.emit("applySpellCorrect", JSON.stringify([{
          importance: that.newImportance,
          similarity: that.newSimilarity
        }]));

        that.touched = false;

        that.getReplacementCount();
      }
    });

    $scope.$on("dSpellR", function() {
      if(that.newSimilarity != 0.75 || that.newImportance != 0.70)
      {
        that.newSimilarity = 0.75;
        that.newImportance = 0.70;

        socket.emit("applySpellCorrect", JSON.stringify([{importance: that.newImportance, similarity: that.newSimilarity}]));

        stats.writeSpell("Number of Replacements", that.getReplacementCount());
        stats.writeSpell("Number of Additional Ground Truth Words", that.countGroundTruth());

        that.touched = false;
      }
    });

    that.undo = function()
    {
      that.newSimilarity = that.similarity;
      that.newImportance = that.importance;

      that.touched = false;

      stats.writeSpell("Number of Replacements", that.getReplacementCount());
      stats.writeSpell("Number of Additional Ground Truth Words", that.countGroundTruth());
    };

    ////////////////////////////////////////////////
    // Replacement Grid
    ////////////////////////////////////////////////

    that.scrollToR = function (rowIndex, colIndex) {
      that.replGridApi.core.scrollTo(that.replGrid.data[rowIndex], that.replGrid.columnDefs[colIndex]);
      that.replGridApi.selection.selectRow(that.replGrid.data[rowIndex]);
    };

    // Grid
    var rowtemplate = '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'removedItem\': grid.appScope.isReplacement( row ), \'newItem\': grid.appScope.isTruth( row ) }" ui-grid-cell></div>';

    $scope.isReplacement = function(row)
    {
      return row.entity.similarity >= that.newSimilarity && row.entity.importanceReplacement < that.newImportance;
    };

    $scope.isTruth = function(row)
    {
      return row.entity.importanceReplacement >= that.newImportance;
    };

    that.replGrid = {
      multiSelect: false,
      rowHeight: 33,
      enableColumnMenus: false,
      enableFiltering: true,
      showGridFooter: true,
      enableGridMenu: true,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      enableFullRowSelection: true,
      rowTemplate:rowtemplate,
      onRegisterApi: function (gridApi) {
        that.replGridApi = gridApi;

        gridApi.cellNav.on.navigate(null, function(newRow, oldRow) {
          if(newRow.col.field == "similarity")
          {
            if (newRow.row.entity.similarity > 0) {
              that.newSimilarity = newRow.row.entity.similarity;
            }
          }

          if(newRow.col.field == "importanceReplacement")
          {
            if (newRow.row.entity.importanceReplacement > 0) {
              that.newImportance = newRow.row.entity.importanceReplacement;
            }
          }

        });
      },
      columnDefs: [
        {field: 'replacement', displayName: "Replaced Word", minWidth: 100, width: "*", cellClass: "textRight"},
        {field: 'importanceReplacement',name: 'Word Quality', cellTemplate: 'views/cellImportanceReplacement.html', width: 120, enableFiltering: false},
        {field: 'similarity', cellTemplate: 'views/cellSimilarity.html', width: 120, enableFiltering: false,
          sort: {
            direction: uiGridConstants.DESC,
            priority: 1
          }
        },
        {field: 'importanceTag',name: 'Higher Word Quality', cellTemplate: 'views/cellImportanceTag.html', width: 120, enableFiltering: false, visible: false},
        {field: 'tag', displayName: "Higher Quality Word", minWidth: 100, width: "*"}
      ]
    };

    that.getReplacementCount = function () {
      return _.sum(_.filter(that.replGrid.data, function (d) {
        return d.similarity >= that.newSimilarity && d.importanceReplacement < that.newImportance;
      }), function () {
        return 1;
      });
    };

    that.countGroundTruth = function () {
      return _.sum(_.filter(that.replGrid.data, function (d) {
        return d.importanceReplacement >= that.newImportance;
      }), function () {
        return 1;
      });
    }

  }]);
