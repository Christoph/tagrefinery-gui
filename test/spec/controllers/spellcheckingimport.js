'use strict';

describe('Controller: SpellcheckingimportCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var SpellcheckingimportCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SpellcheckingimportCtrl = $controller('SpellcheckingimportCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SpellcheckingimportCtrl.awesomeThings.length).toBe(3);
  });
});
