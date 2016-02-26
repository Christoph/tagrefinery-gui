'use strict';

describe('Controller: SpellcheckingparamsCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var SpellcheckingparamsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SpellcheckingparamsCtrl = $controller('SpellcheckingparamsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SpellcheckingparamsCtrl.awesomeThings.length).toBe(3);
  });
});
