'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:LinkedCtrl
 * @description
 * # LinkedCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('LinkedCtrl', ["$scope", "socket", "uiGridConstants", "$timeout", "stats", function ($scope, socket, uiGridConstants, $timeout, stats) {

    // Get instance of the class
    var that = this;
    that.linked = true;

    that.initRunning = false;
    that.preRunning = false;
    that.spellRunning = false;
    that.compRunning = false;

    that.preFilter = false;

    that.vocabCount = stats.getVocab();
    that.datasetCount = stats.getDataset();

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

      that.getSpellTruth();
      that.applySpell();
    };

    that.getSlider = function (value) {
      $scope.$apply(function () {
        that.newSpellS = value;
      });

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

      that.applyCompF();
    };

    that.getCompU = function (threshold) {
      $scope.$apply(function () {
        that.newCompU = threshold;

        stats.writeComp("Number of Frequent Groups", that.getCompUCount());
      });

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

      that.preRemaining = that.getPreCount();
      stats.writePre("Number of Filtered Words", that.preRemaining);
    });

    socket.on('preFilterParams', function (data) {
      that.pre = parseFloat(data);
      that.newPre = that.pre;

      stats.writePre("Minimum Occurrence", that.newPre);
    });

    socket.on('preDictionaryParams', function (data) {
      $scope.dataBlacklist.length = 0;

      _.map(data, function (d) {
        $scope.dataBlacklist.push({word: d});
      });

      stats.writePre("Number of blacklisted Words", $scope.dataBlacklist.length);
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

      stats.writeSpell("Number of Replacements", that.getReplacementCount());
      stats.writeSpell("Number of Additional Ground Truth Words", that.countGroundTruth());
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

    socket.on('postFilterGrid', function (data) {
      that.vocabGrid.data = JSON.parse(data);
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
