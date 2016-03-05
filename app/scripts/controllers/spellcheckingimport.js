'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:SpellcheckingimportCtrl
 * @description
 * # SpellcheckingimportCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('SpellcheckingimportCtrl', ["$scope", "socket", "uiGridConstants", "stats", function ($scope, socket, uiGridConstants, stats) {

    // Get instance of the class
    var that = this;
    that.touched = false;
    $scope.data = [];

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('spellDictionaryParams', function (data) {
      _.map(data, function (d) {
        $scope.data.push({tag: d});
      });

      stats.writeSpell("Number of Ground Truth Words", $scope.data.length);
    });

    $scope.$on("apply", function() {
      if(that.touched)
      {
        socket.emit("applySpellImportedData", JSON.stringify($scope.data));

        stats.writeSpell("Number of Ground Truth Words", $scope.data.length);

        that.touched = false;
      }
    });

    that.clear = function()
    {
      $scope.data.length = 0;
    };

    that.getFile = function(file)
    {
      $scope.$apply(function() {
        $scope.gridApi.importer.importFile( file );
      })
    };

    ////////////////////////////////////////////////
    // Grid
    ////////////////////////////////////////////////

    // Grid
    $scope.gridOptions = {
      enableGridMenu: false,
      showGridFooter: true,
      enableColumnMenus: false,
      enableFiltering: true,
      data: 'data',
      importerDataAddCallback: function (grid, newObjects) {
        $scope.data.length = 0;
        $scope.data = $scope.data.concat(newObjects);
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
        $scope.gridApi.core.refresh();
        that.touched = true;
      },
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
      },
      columnDefs: [
        {field: 'tag', minWidth: 100, width: "*"}
      ]
    };

  }]);
