'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PreprocessingremoveCtrl
 * @description
 * # PreprocessingremoveCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PreprocessingremoveCtrl', ["$scope", "socket", function ($scope, socket) {

    // Get instance of the class
    var that = this;

    that.remove = "'";

   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////

   that.apply = function() 
   {
       socket.emit("applyRemoveCharacters",that.remove);
   };

    // I accordian gets opened => initialize
	if($scope.$parent.status.open[0] == true)
	{
		//socket.emit("getPreprocessingData","preFilterData");
	}
  }]);