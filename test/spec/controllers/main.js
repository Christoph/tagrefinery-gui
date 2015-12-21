'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('tagrefineryGuiApp'));

  var MainCtrl, scope, http, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $http, $httpBackend) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;
    http = $http;
    httpBackend.when('GET','./../../data/data.json')
        .respond([{
              key : 'reuse',
              value : 0.0014705882352941176
            }, {
              key : 'half',
              value : 0.0014705882352941176
            }, {
              key : 'interacting',
              value : 0.0058823529411764705
            }, {
              key : 'the-authors-described-some',
              value : 0.004411764705882353
        }]);
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      $http: $http
      // place here mocked dependencies
    });
  }));

  it('data should be loaded', function () {
    //expect(MainCtrl.data.length).toBeGreaterThan(0);
  });
});
