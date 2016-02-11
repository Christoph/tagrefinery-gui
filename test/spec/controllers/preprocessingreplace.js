'use strict';

describe('Controller: PreprocessingreplaceCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var PreprocessingreplaceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PreprocessingreplaceCtrl = $controller('PreprocessingreplaceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PreprocessingreplaceCtrl.awesomeThings.length).toBe(3);
  });
});
