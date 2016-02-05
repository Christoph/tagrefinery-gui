'use strict';

describe('Directive: d3Hist', function () {

  // load the directive's module
  beforeEach(module('tagrefineryGuiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<d3-hist></d3-hist>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the d3Hist directive');
  }));
});
