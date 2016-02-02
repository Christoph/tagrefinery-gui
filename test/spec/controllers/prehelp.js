'use strict';

describe('Controller: PrehelpctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var PrehelpctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PrehelpctrlCtrl = $controller('PrehelpctrlCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PrehelpctrlCtrl.awesomeThings.length).toBe(3);
  });
});
