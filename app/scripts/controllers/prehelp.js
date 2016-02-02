'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:PrehelpctrlCtrl
 * @description
 * # PrehelpctrlCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('PreHelpCtrl', function ($scope, $uibModalInstance) {

  $scope.close = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
