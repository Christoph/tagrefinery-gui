'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PreprocessingreplaceCtrl
 * @description
 * # PreprocessingreplaceCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PreprocessingreplaceCtrl', ["$scope", "socket", function ($scope, socket) {

    // Get instance of the class
    var that = this;

    that.replace = [];
    that.out = [];
    that.word = "";
	that.by = "";

    that.add = function()
    {
    	var word, by;

    	if(that.word.length < 1 )
    	{
    		that.word = "<Space>";
    		word = " ";
    	}
    	else
    	{
    		word = that.word;
    	}

    	if(that.by.length < 1)
    	{
    		that.by = "<Space>";
    		by = " ";
    	}
    	else
    	{
    		by = that.by;
    	}

		that.replace.push({replace: that.word, by:that.by});	
		that.out.push({replace: word, by: by});	

		that.word = "";
		that.by = "";
    }

    that.remove = function(index)
    {
    	that.replace.splice(index,1);
    	that.out.splice(index,1);
    }

   ////////////////////////////////////////////////
   // Socket functions
   ////////////////////////////////////////////////

   that.apply = function() 
   {
       socket.emit("applyReplaceCharacters",JSON.stringify(that.out));
   };

    // I accordian gets opened => initialize
	if($scope.$parent.status.open[0] == true)
	{
		//socket.emit("getPreprocessingData","preFilterData");
	}
  }]);