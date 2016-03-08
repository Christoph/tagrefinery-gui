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
    that.linked = false;

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
    };

    that.getSpellI = function (threshold) {
      $scope.$apply(function () {
        that.newSpellI = threshold;
      });

      that.getSpellCount();
    };

    that.getCompF = function (threshold) {
      $scope.$apply(function () {
        that.newCompF = threshold;

        stats.writeComp("Number of Frequent Groups", that.getCompFCount());
      });
    };

    that.getCompU = function (threshold) {
      $scope.$apply(function () {
        that.newCompU = threshold;

        stats.writeComp("Number of Frequent Groups", that.getCompUCount());
      });
    };

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('isGuided', function (data) {
      if (data == "false")
      {
        that.linked = true;
      }
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
      that.getSpellCount();
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

    ////////////////////////////////////////////////
    // Helper
    ////////////////////////////////////////////////

    that.getPreCount = function () {
      return _.sum(that.preData, function(d) { return d.count; }) - _.sum(_.filter(that.preData, function (d) {
          return d.value < that.newPre;
        }), function (o) {
          return o.count;
        });
    };

    that.getSpellCount = function()
    {
      socket.emit("getReplacements", JSON.stringify([{importance: that.newSpellI, similarity: that.newSpellS}]));
    };

    that.getSlider = function (value) {
      $scope.$apply(function () {
        that.newSpellS = value;
      });

      that.getSpellCount();
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
