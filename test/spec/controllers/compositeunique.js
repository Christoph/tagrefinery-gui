'use strict';

describe('Controller: CompositeuniqueCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var CompositeuniqueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompositeuniqueCtrl = $controller('CompositeuniqueCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CompositeuniqueCtrl.awesomeThings.length).toBe(3);
  });
});
