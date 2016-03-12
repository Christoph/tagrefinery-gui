'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PostprocessingreplaceCtrl
 * @description
 * # PostprocessingreplaceCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PostprocessingreplaceCtrl', ["$scope", "socket", "uiGridConstants", "$timeout", "$q", "stats", function ($scope, socket, uiGridConstants, $timeout, $q, stats) {

    // Get instance of the class
    var that = this;

    that.touched = false;

    that.replace = [];
    that.replaceOriginal = [];

    that.remove = [];
    that.removeOriginal = [];

    that.original = [];

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('postImportantWords', function (data) {
      var temp = JSON.parse(data);

      that.original = _.map(temp, function(d) {
        if(that.replace[d.tag])
        {
          return {tag: d.tag, replace: that.replace[d.tag], remove: false}
        }
        else if(that.remove[d.tag])
        {
          return {tag: d.tag, replace: "", remove: true}
        }
        else
        {
          return {tag: d.tag, replace: "", remove: false }
        }
      });

      that.edit.data = _.cloneDeep(that.original)
    });

    socket.on('postReplaceParams', function (data) {
      that.replace.length = 0;
      that.replaceOriginal.length = 0;

      _.each(data, function (d) {
        var temp = d.split(",");

        that.replace[temp[0]] = temp[1];
        that.replaceOriginal[temp[0]] = temp[1];
      });

    });

    socket.on('postRemoveParams', function (data) {
      that.remove.length = 0;
      that.removeOriginal.length = 0;

      _.each(data, function (d) {
        that.remove[d] = true;
        that.removeOriginal[d] = true;
      });

    });

    socket.on('postSalvageData', function (data) {
      that.salvage.data = JSON.parse(data);

      stats.writePost("Number of Salvaged Tags", that.salvage.data.length);
    });

    that.apply = function () {
      socket.emit("applySalvaging", "");

      that.replaceOriginal = _.cloneDeep(that.replace);
      that.removeOriginal = _.clone(that.remove);
    };

    that.undo = function()
    {
      that.edit.data = _.cloneDeep(that.original);
      that.replace = _.cloneDeep(that.replaceOriginal);
      that.touched = false;
    };

    ////////////////////////////////////////////////
    // Salvaging
    ////////////////////////////////////////////////

    // Grid

    that.salvage = {
      enableFiltering: true,
      enableColumnMenus: false,
      multiSelect: false,
      showGridFooter: true,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      enableGridMenu: true,
      onRegisterApi: function (gridApi) {
        that.salvageGridApi = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        });
      },
      columnDefs: [
        {field: 'truth', displayName: 'Important Tag', minWidth: 100, width: "*"},
        {field: 'replacement', displayName: 'Salvaged Tag', minWidth: 100, width: "*"}
      ]
    };

    ////////////////////////////////////////////////
    // Edit
    ////////////////////////////////////////////////

    var rowtpl = '<div ng-class="{\'default\':true,  \'removed\': grid.appScope.isRemoved( row ), \'edited\': grid.appScope.isEdited( row ) }"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';

    $scope.isRemoved = function(row)
    {
      return row.entity.remove == true;
    };

    $scope.isEdited = function(row)
    {
      return row.entity.replace.length > 0;
    };

    that.edit = {
      enableFiltering: true,
      enableColumnMenus: false,
      enableGridMenu: true,
      enableCellEditOnFocus: true,
      rowTemplate: rowtpl,
      onRegisterApi: function (gridApi) {
        that.editApi = gridApi;

        gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
          if(newValue)
          {
            that.touched = true;

            if(colDef.name == 'replace') {
              if(rowEntity.tag in that.replace)
              {
                if(that.replace[rowEntity.tag] != newValue)
                {
                  that.replace[rowEntity.tag] = newValue;

                  socket.emit("applyPostReplace", JSON.stringify(that.replace));
                }
              }
              else
              {
                that.replace[rowEntity.tag] = newValue;

                socket.emit("applyPostReplace", JSON.stringify(that.replace));
              }
            }

            if(colDef.name == 'remove' && !rowEntity.tag in that.remove) {
              if(newValue == true) that.remove[rowEntity.tag] = true;


              socket.emit("applyPostRemove", JSON.stringify(that.remove));
            }
          }

          if(oldValue)
          {
            if(colDef.name == 'replace') {
              delete that.replace[rowEntity.tag];

              socket.emit("applyPostReplace", JSON.stringify(that.replace));
            }

            if(colDef.name == 'remove') {
              delete that.remove[rowEntity.tag];

              socket.emit("applyPostRemove", JSON.stringify(that.remove));
            }
          }
        })

      },
      columnDefs: [
        {field: 'tag', displayName: 'Tag', minWidth: 100, width: "*", enableCellEdit: false },
        {field: 'replace', displayName: 'Replace By', minWidth: 100, width: "*"},
        {field: 'remove', displayName: 'Remove', minWidth: 100, width: "*", type:'boolean'}
      ]
    };

    that.openGrid = function()
    {
      if(that.showDetails) {
        socket.emit("computeSalvaging", "");
        document.getElementById("postEscroll").scrollIntoView()
      }
    };

  }]);
