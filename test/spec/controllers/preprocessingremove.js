'use strict';

describe('Controller: PreprocessingremoveCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var PreprocessingremoveCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PreprocessingremoveCtrl = $controller('PreprocessingremoveCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PreprocessingremoveCtrl.awesomeThings.length).toBe(3);
  });
});
