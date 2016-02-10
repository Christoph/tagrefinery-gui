'use strict';

describe('Controller: SpellcheckingfindCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var SpellcheckingfindCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SpellcheckingfindCtrl = $controller('SpellcheckingfindCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SpellcheckingfindCtrl.awesomeThings.length).toBe(3);
  });
});
