'use strict';

describe('Controller: CompositefrequentCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var CompositefrequentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompositefrequentCtrl = $controller('CompositefrequentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CompositefrequentCtrl.awesomeThings.length).toBe(3);
  });
});
