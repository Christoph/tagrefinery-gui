'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PreprocessingimportCtrl
 * @description
 * # PreprocessingimportCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PreprocessingimportCtrl', ["$scope", "socket", "uiGridConstants", "stats", function ($scope, socket, uiGridConstants, stats) {

    // Get instance of the class
    var that = this;
    that.default = "a,b,c,d,e,f,g,a,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9,able,about,across,after,all,almost,also,am,among,an,and,any,are,as,at,be,because,been,but,by,can,cannot,could,dear,did,do,does,either,else,ever,every,for,from,get,got,had,has,have,he,her,hers,him,his,how,however,i,if,in,into,is,it,its,just,least,let,like,likely,may,me,might,most,must,my,neither,no,nor,not,of,off,often,on,only,or,other,our,own,rather,said,say,says,she,should,since,so,some,than,that,the,their,them,then,there,these,they,this,tis,to,too,twas,us,wants,was,we,were,what,when,where,which,while,who,whom,why,will,with,would,yet,you,your";

    that.touched = false;
    $scope.dataP = [];

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('preDictionaryParams', function (data) {
      $scope.dataP.length = 0;

      _.map(data, function (d) {
        $scope.dataP.push({word: d});
      });

      stats.writePre("Number of blacklisted Words", $scope.dataP.length);
    });

    $scope.$on("apply", function() {
      if(that.touched)
      {
        socket.emit("applyPreImportedData", JSON.stringify($scope.dataP));

        stats.writePre("Number of blacklisted Words", $scope.dataP.length);

        that.touched = false;
      }
    });

    $scope.$on("noPreB", function() {
      that.clear();

      socket.emit("applyPreImportedData", JSON.stringify($scope.dataP));

      stats.writePre("Number of blacklisted Words", $scope.dataP.length);

      that.touched = false;
    });

    $scope.$on("dPreB", function() {
      that.clear();

      _.map(that.default.split(","), function (d) {
        $scope.dataP.push({word: d});
      });

      socket.emit("applyPreImportedData", JSON.stringify($scope.dataP));

      stats.writePre("Number of blacklisted Words", $scope.dataP.length);

      that.touched = false;
    });

    that.clear = function()
    {
      $scope.dataP.length = 0;

      that.touched = true;
    };

    that.getFile = function(file)
    {
      $scope.$apply(function() {
        $scope.gridApi.importer.importFile( file );
        that.dataChanged = true;
      })
    };

    ////////////////////////////////////////////////
    // Grid
    ////////////////////////////////////////////////

    // Grid
    $scope.dataP = [];
    $scope.gridOptions = {
      enableGridMenu: false,
      showGridFooter: true,
      enableColumnMenus: false,
      enableFiltering: true,
      data: 'dataP',
      importerDataAddCallback: function (grid, newObjects) {
        $scope.dataP.length = 0;
        $scope.dataP = $scope.dataP.concat(newObjects);
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
        $scope.gridApi.core.refresh();
        that.touched = true;
      },
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
      },
      columnDefs: [
        {field: 'word', minWidth: 100, width: "*"}
      ]
    };

  }]);
