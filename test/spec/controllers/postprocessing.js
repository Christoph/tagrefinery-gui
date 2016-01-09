'use strict';

describe('Controller: PostprocessingCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var PostprocessingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostprocessingCtrl = $controller('PostprocessingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PostprocessingCtrl.awesomeThings.length).toBe(3);
  });
});
