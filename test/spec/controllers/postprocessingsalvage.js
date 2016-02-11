'use strict';

describe('Controller: PostprocessingsalvageCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var PostprocessingsalvageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostprocessingsalvageCtrl = $controller('PostprocessingsalvageCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PostprocessingsalvageCtrl.awesomeThings.length).toBe(3);
  });
});
