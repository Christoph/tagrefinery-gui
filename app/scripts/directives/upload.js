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

        scope.$on("$destroy", function() {
          $timeout.cancel(scope.timer);
        });

        // Rendering
        scope.timer = $timeout(function () {
          scope.handleFileSelect = function( event ){
            var target = event.srcElement || event.target;

            if (target && target.files && target.files.length === 1) {
              var fileObject = target.files[0];
              scope.getFile({file: fileObject});

              target.form.reset();
            }
          };

          scope.fileChooser = document.querySelectorAll('.upload');

          if ( scope.fileChooser.length !== 1 ){
            console.log('Found > 1 or < 1 file choosers within the menu item, error, cannot continue');
          } else {
            scope.fileChooser[0].addEventListener('change', scope.handleFileSelect, false);
          }
        }, 100);
      }
    };
  }]);
