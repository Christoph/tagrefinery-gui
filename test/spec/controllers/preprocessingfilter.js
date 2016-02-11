'use strict';

describe('Controller: PreprocessingfilterCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var PreprocessingfilterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PreprocessingfilterCtrl = $controller('PreprocessingfilterCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PreprocessingfilterCtrl.awesomeThings.length).toBe(3);
  });
});
