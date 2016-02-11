'use strict';

describe('Controller: PostprocessingimportantCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var PostprocessingimportantCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostprocessingimportantCtrl = $controller('PostprocessingimportantCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PostprocessingimportantCtrl.awesomeThings.length).toBe(3);
  });
});
