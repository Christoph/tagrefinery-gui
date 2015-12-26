'use strict';

describe('Directive: d3Bars', function () {

  // load the directive's module
  beforeEach(module('tagrefineryGuiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {

      element = angular.element(
              '<div d3-bars data="data"></div>'
              );

    scope = $rootScope.$new();
    scope.data = [];
    $compile(element) (scope);
    scope.$digest();
    
  }));
  

  it('should generate svg', inject(function () {
      var svg = element.find('svg');
      expect(svg.length).toBe(1);
  }));

  it('should create three containers', function () {
      var groups = element.find('svg').find('g');
      expect(groups.length).toBe(3);
      });

  it('should create a element', function() {
      var rect = element.find('svg').find('rect');
      expect(rect.length).toBe(0);

      scope.data.push({
          name: 'Test',
          score: 50
      });
      scope.$digest();

      rect = element.find('svg').find('g').find('rect');
      expect(rect.length).toBe(1);
  });

});
