'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:LinkedCtrl
 * @description
 * # LinkedCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('LinkedCtrl', ["$scope", "socket", "uiGridConstants", "$interval", "stats", function ($scope, socket, uiGridConstants, $interval, stats) {

    // Get instance of the class
    var that = this;
    that.linked = true;

    that.initRunning = false;
    that.preRunning = false;
    that.spellRunning = false;
    that.compRunning = false;

    that.preFilter = false;

    that.vocabIn = 0;
    that.datasetIn = 0;
    that.vocabOut = 0;
    that.datasetOut = 0;

    that.spellChanged = false;
    that.compChanged = false;
    that.vocabInChanged = false;
    that.datasetInChanged = false;
    that.vocabOutCHanged = false;
    that.datasetOutChanged = false;

    // PRE
    that.preData = [];
    that.pre = 0;
    that.newPre = 0;

    // SPELL
    that.spellData = [];
    that.spellI = 0;
    that.newSpellI = 0;
    that.spellS = 0;
    that.newSpellS = 0;
    that.spellDomain = [0,1];
    that.spellRepl = 0;
    that.spellTruth = 0;

    // COMP
    that.compDataF = [];
    that.compDataU = [];
    that.compF = 0;
    that.compU = 0;
    that.newCompF = 0;
    that.newCompU = 0;

    ////////////////////////////////////////////////
    // D3 functions
    ////////////////////////////////////////////////

    that.getPre = function (occurrences) {
      $scope.$apply(function () {
        that.newPre = occurrences;

        that.filteredWords = that.getPreCount();
        stats.writePre("Number of Remaining Words", that.filteredWords);
      });

      that.applyPre();
    };


    that.getSpellI = function (threshold) {
      $scope.$apply(function () {
        that.newSpellI = threshold;
      });

      that.spellChanged = true;

      that.getSpellTruth();
      that.applySpell();
    };

    that.getSlider = function (value) {
      $scope.$apply(function () {
        that.newSpellS = value;
      });

      that.spellChanged = true;

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

      that.getSpellTruth();
      that.applySpell();
    };


    that.getCompF = function (threshold) {
      $scope.$apply(function () {
        that.newCompF = threshold;

        stats.writeComp("Number of Frequent Groups", that.getCompFCount());
      });

      that.compChanged = true;

      that.applyCompF();
    };

    that.getCompU = function (threshold) {
      $scope.$apply(function () {
        that.newCompU = threshold;

        stats.writeComp("Number of Frequent Groups", that.getCompUCount());
      });

      that.compChanged = true;

      that.applyCompU();
    };

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('selectedMode', function (data) {
      if (data == "linked")
      {
        that.linked = true;
      }
    });

    socket.on('preVocabSize', function (data) {
      that.vocabIn = data;
      that.vocabInChanged = true;
    });

    socket.on('compVocabSize', function (data) {
      that.vocabOut = data;
      that.vocabOutCHanged = true;
    });

    socket.on('preDataset', function (data) {
      that.datasetIn = data;
      that.datasetInChanged = true;
    });

    socket.on('compDataset', function (data) {
      that.datasetOut = data;
      that.datasetOutChanged = true;
    });

    socket.on('initRunning', function (data) {
      that.initRunning = data == "started"
    });

    socket.on('computePre', function (data) {
      that.preRunning = data == "started"
    });

    socket.on('computeSpell', function (data) {
      that.spellRunning = data == "started"
    });

    socket.on('computeComp', function (data) {
      that.compRunning = data == "started"
    });

    // PRE
    socket.on('preFilterData', function (data) {
      that.preData = JSON.parse(data);
    });

    socket.on('preFilterParams', function (data) {
      that.pre = parseFloat(data);
      that.newPre = that.pre;

      stats.writePre("Minimum Occurrence", that.newPre);
    });

    // SPELL
    socket.on('spellImportance', function (data) {
      that.spellI = parseFloat(data);
      that.newSpellI = that.spellI;

      stats.writeSpell("Minimum Word Quality", Math.round(that.newSpellI * 1000) / 1000);
    });

    socket.on('spellSimilarity', function (data) {
      that.spellS = parseFloat(data);
      that.newSpellS = that.spellS;

      stats.writeSpell("Minimum Word Similarity ", Math.round(that.newSpellS * 1000) / 1000);
    });

    socket.on('importance', function (data) {
      that.spellData = JSON.parse(data);
    });

    socket.on('replacementData', function (data) {
      that.replGrid.data = JSON.parse(data);
    });

    // COMP
    socket.on('frequentData', function (data) {
      that.compDataF = JSON.parse(data);

      stats.writeComp("Number of Frequent Groups", that.getCompFCount());
    });

    socket.on('compFrequentParams', function (data) {
      that.newCompF = parseFloat(data);
      that.compF = that.newCompF;
    });

    socket.on('uniqueData', function (data) {
      that.compDataU = JSON.parse(data);

      stats.writeComp("Number of Unique Groups", that.getCompUCount());
    });

    socket.on('compUniqueParams', function (data) {
      that.newCompU = parseFloat(data);
      that.compU = that.newCompU;
    });

    that.last = [];
    that.out = [];

    // OUT
    socket.on('postFilterGrid', function (json) {
      var data = JSON.parse(json);
      that.out.length = 0;

      that.out = _.map(data, function(d) {
        if(_.find(that.last, { "tag": d.tag }))
        {
          _.remove(that.last, { "tag": d.tag });
          return {tag: d.tag, importance: d.importance, changed: 0}
        }
        else
        {
          return {tag: d.tag, importance: d.importance, changed: 2}
        }
      });

      if(that.last.length > 0)
      {
        _.forEach(that.last, function(d) {
          that.out.push({tag: d.tag, importance: d.importance, changed: 1})
        });
      }

      that.last.length = 0;

      that.vocabGrid.data = that.out;
      that.last = _.cloneDeep(that.out);
    });

    $scope.$on('$destroy', function() {
      socket.removeAllListeners('selectedMode');
      socket.removeAllListeners('preVocabSize');
      socket.removeAllListeners('compVocabSize');
      socket.removeAllListeners('preDataset');
      socket.removeAllListeners('compDataset');
      socket.removeAllListeners('initRunning');
      socket.removeAllListeners('computePre');
      socket.removeAllListeners('computeSpell');
      socket.removeAllListeners('computeComp');
      socket.removeAllListeners('preFilterData');
      socket.removeAllListeners('preFilterParams');
      socket.removeAllListeners('spellImportance');
      socket.removeAllListeners('spellSimilarity');
      socket.removeAllListeners('importance');
      socket.removeAllListeners('replacementData');
      socket.removeAllListeners('frequentData');
      socket.removeAllListeners('compFrequentParams');
      socket.removeAllListeners('uniqueData');
      socket.removeAllListeners('compUniqueParams');
      socket.removeAllListeners('postFilterGrid');
    });

    // APPLY
    that.applyPre = _.debounce(function() {
      socket.emit("applyPrefilter", "" + that.newPre);
      socket.emit("computeWorkflow", "");
    }, 1000);

    that.applySpell = _.debounce(function() {
      socket.emit("applySpellCorrect", JSON.stringify([{importance: that.newSpellI, similarity: that.newSpellS}]));
      socket.emit("computeWorkflow", "");
    }, 1000);

    that.applyCompF = _.debounce(function() {
      socket.emit("applyFrequentThreshold", "" + that.newCompF);
      socket.emit("computeWorkflow", "");
    }, 1000);

    that.applyCompU = _.debounce(function() {
      socket.emit("applyUniqueThreshold", "" + that.newCompU);
      socket.emit("computeWorkflow", "");
    }, 1000);

    that.applyPreB = _.debounce(function() {
      socket.emit("applyPreImportedData", JSON.stringify($scope.dataBlacklist));
      socket.emit("computeWorkflow", "");
    }, 1000);

    ////////////////////////////////////////////////
    // Grids
    ////////////////////////////////////////////////

    var rowtpl = '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'newItem\': grid.appScope.isNew( row ), \'removedItem\': grid.appScope.isRemoved( row ) }" ui-grid-cell></div>';

    $scope.isNew = function(row)
    {
      return row.entity.changed == 2;
    };

    $scope.isRemoved = function(row)
    {
      return row.entity.changed == 1;
    };

    that.vocabGrid = {
      rowTemplate: rowtpl,
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
        {field: 'changed', displayName: "Tag has Changed", minWidth: 50, width: "*", visible: false,
          sort: {
            direction: uiGridConstants.DESC,
            priority: 1
          }
        }
      ]
    };

    var rowtemplate = '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'replacement\': grid.appScope.isReplacement( row ), \'truth\': grid.appScope.isTruth( row ) }" ui-grid-cell></div>';

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

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          if (row.entity.similarity > 0) {
            that.newSimilarity = row.entity.similarity;
          }

          // Tells the grid to redraw after click
          gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
        });
      },
      columnDefs: [
        {field: 'replacement', displayName: "Replaced Word", minWidth: 100, width: "*", cellClass: "textRight"},
        {field: 'importanceReplacement',name: 'Lower Word Quality', cellTemplate: 'views/cellImportanceReplacement.html', width: 120, enableFiltering: false},
        {field: 'similarity', cellTemplate: 'views/cellSimilarity.html', width: 120, enableFiltering: false,
          sort: {
            direction: uiGridConstants.DESC,
            priority: 1
          }
        },
        {field: 'importanceTag',name: 'Higher Word Quality', cellTemplate: 'views/cellImportanceTag.html', width: 120, enableFiltering: false},
        {field: 'tag', displayName: "Higher Quality Word", minWidth: 100, width: "*"}
      ]
    };

    ////////////////////////////////////////////////
    // Helper
    ////////////////////////////////////////////////

    that.clear = function()
    {
      $scope.dataBlacklist.length = 0;

      that.applyPreB();
    };

    that.getFile = function(file)
    {
      $scope.$apply(function() {
        $scope.gridApi.importer.importFile( file );
      })
    };

    that.goToResult = function()
    {
      socket.emit("selectMode", "guided");
    };

    that.resetHighlight = function()
    {
      console.log("tset")
      that.spellChanged = false;
      that.compChanged = false;
      that.vocabInChanged = false;
      that.datasetInChanged = false;
      that.vocabOutCHanged = false;
      that.datasetOutChanged = false;
    };

    var timer = $interval(that.resetHighlight, 10000);

    $scope.$on("$destroy", function() {
      $interval.cancel(timer);
    });

    that.getReplacementCount = function () {
      return _.sum(_.filter(that.replGrid.data, function (d) {
        return d.similarity >= that.newSpellS && d.importanceReplacement < that.newSpellI;
      }), function () {
        return 1;
      });
    };

    that.getSpellTruth = function () {
      that.spellTruth =  _.sum(_.filter(that.spellData, function (d) {
          return d.value >= that.newSpellI;
        }), function (o) {
          return o.count;
        });
    };

    that.getCompFCount = function () {
      return _.sum(_.filter(that.compDataF, function (d) {
        return d.value >= that.newCompF;
      }), function (o) {
        return o.count;
      });
    };

    that.getCompUCount = function () {
      return _.sum(_.filter(that.compDataU, function (d) {
        return d.value >= that.newCompU;
      }), function (o) {
        return o.count;
      });
    };
  }]);
