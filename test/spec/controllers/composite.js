'use strict';

describe('Controller: CompositeCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var CompositeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompositeCtrl = $controller('CompositeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CompositeCtrl.awesomeThings.length).toBe(3);
  });
});
