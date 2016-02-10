'use strict';

describe('Controller: SpellcheckingCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var SpellcheckingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SpellcheckingCtrl = $controller('SpellcheckingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SpellcheckingCtrl.awesomeThings.length).toBe(3);
  });
});
