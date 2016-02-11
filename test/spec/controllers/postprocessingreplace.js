'use strict';

describe('Controller: PostprocessingreplaceCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var PostprocessingreplaceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostprocessingreplaceCtrl = $controller('PostprocessingreplaceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PostprocessingreplaceCtrl.awesomeThings.length).toBe(3);
  });
});
