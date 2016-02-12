'use strict';

describe('Controller: SpellcheckingsetCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var SpellcheckingsetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SpellcheckingsetCtrl = $controller('SpellcheckingsetCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SpellcheckingsetCtrl.awesomeThings.length).toBe(3);
  });
});
