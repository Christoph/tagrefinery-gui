'use strict';

describe('Directive: d3Slider', function () {

  // load the directive's module
  beforeEach(module('tagrefineryGuiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<d3-slider></d3-slider>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the d3Slider directive');
  }));
});
