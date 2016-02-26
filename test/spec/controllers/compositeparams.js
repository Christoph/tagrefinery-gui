'use strict';

describe('Controller: CompositeparamsCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var CompositeparamsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompositeparamsCtrl = $controller('CompositeparamsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CompositeparamsCtrl.awesomeThings.length).toBe(3);
  });
});
