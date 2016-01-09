'use strict';

describe('Controller: PreprocessingCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var PreprocessingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PreprocessingCtrl = $controller('PreprocessingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PreprocessingCtrl.awesomeThings.length).toBe(3);
  });
});
