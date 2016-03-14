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
    that.salvagingRunning = false;

    that.replace = [];
    that.replace.push({});

    that.replaceOriginal = [];
    that.replaceOriginal.push({});


    that.remove = [];
    that.remove.push({});

    that.removeOriginal = [];
    that.removeOriginal.push({});

    that.original = [];

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('postImportantWords', function (data) {
      var temp = JSON.parse(data);

      that.original = _.map(temp, function(d) {

        if(that.remove[0][d.tag])
        {
          return {tag: d.tag, replace: "", remove: true}
        }
        else if(that.replace[0][d.tag])
        {
          return {tag: d.tag, replace: that.replace[0][d.tag], remove: false}
        }
        else
        {
          return {tag: d.tag, replace: "", remove: false }
        }
      });

      that.edit.data = _.cloneDeep(that.original)
    });

    socket.on('postReplaceParams', function (data) {
      _.each(data, function (d) {
        var temp = d.split(",");

        that.replace[0][temp[0]] = temp[1];
        that.replaceOriginal[0][temp[0]] = temp[1];
      });

    });

    socket.on('postRemoveParams', function (data) {
      _.each(data, function (d) {
        that.remove[0][d] = true;
        that.removeOriginal[0][d] = true;
      });
    });

    socket.on('postSalvaging', function (data) {
      that.salvagingRunning = data == "true";
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

    $scope.$on("undo", function() {
      if(that.touched)
      {
        that.undo();
        socket.emit("applyPostReplace", JSON.stringify(that.replace));
        socket.emit("applyPostRemove", JSON.stringify(that.remove));
      }
    });

    $scope.$on("postSalvage", function() {
      socket.emit("applyPostReplace", JSON.stringify(that.replace));
      socket.emit("applyPostRemove", JSON.stringify(that.remove));

      that.apply();
    });

    that.undo = function()
    {
      that.edit.data = _.cloneDeep(that.original);
      that.replace = _.cloneDeep(that.replaceOriginal);
      that.remove = _.cloneDeep(that.removeOriginal);
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
              if(rowEntity.tag in that.replace[0])
              {
                if(that.replace[0][rowEntity.tag] != newValue)
                {
                  that.replace[0][rowEntity.tag] = newValue;

                  socket.emit("applyPostReplace", JSON.stringify(that.replace));
                }
              }
              else
              {
                that.replace[0][rowEntity.tag] = newValue;

                socket.emit("applyPostReplace", JSON.stringify(that.replace));
              }
            }

            if(colDef.name == 'remove' && !(rowEntity.tag in that.remove[0])) {
              if(newValue == true) that.remove[0][rowEntity.tag] = true;

              socket.emit("applyPostRemove", JSON.stringify(that.remove));
            }
          }

          if(oldValue)
          {
            if(colDef.name == 'replace') {
              delete that.replace[0][rowEntity.tag];

              socket.emit("applyPostReplace", JSON.stringify(that.replace));
            }

            if(colDef.name == 'remove') {
              delete that.remove[0][rowEntity.tag];

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
