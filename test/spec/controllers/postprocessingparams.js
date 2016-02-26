'use strict';

describe('Controller: PostprocessingparamsCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var PostprocessingparamsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostprocessingparamsCtrl = $controller('PostprocessingparamsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PostprocessingparamsCtrl.awesomeThings.length).toBe(3);
  });
});
