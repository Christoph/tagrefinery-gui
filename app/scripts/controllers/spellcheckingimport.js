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
    $scope.dataS = [];

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('spellDictionaryParams', function (data) {
      $scope.dataS.length = 0;

      _.map(data, function (d) {
        $scope.dataS.push({tag: d});
      });

      stats.writeSpell("Number of Dictionary Words", $scope.dataS.length);
    });

    $scope.$on("apply", function() {
      if(that.touched)
      {
        socket.emit("applySpellImportedData", JSON.stringify($scope.dataS));

        stats.writeSpell("Number of Dictionary Words", $scope.dataS.length);

        that.touched = false;
      }
    });

    that.clear = function()
    {
      $scope.dataS.length = 0;

      that.touched = true;
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
      data: 'dataS',
      importerDataAddCallback: function (grid, newObjects) {
        $scope.dataS.length = 0;
        $scope.dataS = $scope.dataS.concat(newObjects);
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
