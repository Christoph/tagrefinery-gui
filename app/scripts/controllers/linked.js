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

    ////////////////////////////////////////////////
    // D3 functions
    ////////////////////////////////////////////////

    that.getPre = function (occurrences) {
      $scope.$apply(function () {
        that.newOccurrences = occurrences;

        if (that.showDetails) {
          $timeout(function () {
            that.scrollTo(that.getAboveRow(that.grid.data, that.newOccurrences), 0);
          })
        }

        that.filteredWords = that.getPreCount();
        stats.writePre("Number of Remaining Words", that.filteredWords);

        that.touched = true;
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

    ////////////////////////////////////////////////
    // Helper
    ////////////////////////////////////////////////

    that.getPreCount = function () {
      return _.sum(that.preData, function(d) { return d.count; }) - _.sum(_.filter(that.preData, function (d) {
          return d.value < that.newPre;
        }), function (o) {
          return o.count;
        });

    }
  }]);
