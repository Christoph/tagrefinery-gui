'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PostprocessingreplaceCtrl
 * @description
 * # PostprocessingreplaceCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PostprocessingreplaceCtrl', ["$scope", "socket", "uiGridConstants", "$timeout", "$q", function ($scope, socket, uiGridConstants, $timeout, $q) {

    // Get instance of the class
    var that = this;

    that.replace = [];
    that.old;

    that.remove = function (index) {
      that.replace.splice(index, 1);
    }
    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('postImportantWords', function (data) {
      that.grid.data = JSON.parse(data);
    });

    socket.on('postReplaceParams', function (data) {
      that.replace.length = 0;

      _.each(data, function (d) {
        var temp = d.split(",");
        that.replace.push({replace: temp[0], by: temp[1]});
      })
    });

    that.apply = function () {
      socket.emit("applyPostReplace", JSON.stringify(that.replace));
    };

    ////////////////////////////////////////////////
    // Grid
    ////////////////////////////////////////////////

    that.deleteRow = function (row) {
      var index = that.grid.data.indexOf(row.entity);
      that.grid.data.splice(index, 1);
    };


    that.revert = function () {
      that.changes = false;

      that.grid.data = _.clone(that.temp);
    }

    that.saveRow = function (rowEntity) {
      var promise = $q.defer();
      that.gridApi.rowEdit.setSavePromise(rowEntity, promise.promise);

      that.replace.push({replace: that.old, by: rowEntity.tag});

      promise.resolve();
    };

    // Grid

    that.grid = {
      enableFiltering: true,
      enableColumnMenus: false,
      multiSelect: false,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      enableullRowSelection: true,
      enableGridMenu: true,
      onRegisterApi: function (gridApi) {
        that.gridApi = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          that.old = row.entity.tag;
        });

        gridApi.rowEdit.on.saveRow($scope, that.saveRow);
      },
      columnDefs: [
        {field: 'tag', minWidth: 100, width: "*"}
      ]
    };


  }]);
