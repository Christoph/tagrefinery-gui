'use strict';

describe('Controller: PreprocessingimportCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var PreprocessingimportCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PreprocessingimportCtrl = $controller('PreprocessingimportCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PreprocessingimportCtrl.awesomeThings.length).toBe(3);
  });
});
