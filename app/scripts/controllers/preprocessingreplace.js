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

   socket.on('preReplaceParams', function(data) {
    that.replace.length = 0;
    that.out.length = 0;
    
    _.each(data, function(d) {
        var temp = d.split(",");

        if(temp[0] === " ")
        {
            that.replace.push({replace: "<Space>", by:temp[1]});	
        }
        if(temp[1] === " ")
        {
            that.replace.push({replace: temp[0], by: "<Space>"});	
        }
		that.out.push({replace: temp[0], by: temp[1]});	
    })
   });

   that.apply = function() 
   {
       socket.emit("applyReplaceCharacters",JSON.stringify(that.out));
   };

  }]);
