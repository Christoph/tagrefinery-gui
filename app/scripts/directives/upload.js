'use strict';

/**
 * @ngdoc directive
 * @name tagrefineryGuiApp.directive:d3Hist
 * @description
 * # d3Hist
 */
angular.module('tagrefineryGuiApp')
  .directive('uploadButton', ["$timeout", function ($timeout) {
    return {
      restrict: 'EA',
      scope: {
        getFile: '&'
      },
      templateUrl: 'views/upload.html',
      link: function (scope) {
        // Rendering
        $timeout(function () {
          var handleFileSelect = function( event ){
            var target = event.srcElement || event.target;

            if (target && target.files && target.files.length === 1) {
              var fileObject = target.files[0];
              scope.getFile({file: fileObject});

              target.form.reset();
            }
          };

          var fileChooser = document.querySelectorAll('.upload');

          if ( fileChooser.length !== 1 ){
            console.log('Found > 1 or < 1 file choosers within the menu item, error, cannot continue');
          } else {
            fileChooser[0].addEventListener('change', handleFileSelect, false);
          }
        }, 100);
      }
    };
  }]);
