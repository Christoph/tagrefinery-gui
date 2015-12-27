'use strict';

describe('Service: httpLoader', function () {

  // load the service's module
  beforeEach(module('tagrefineryGuiApp'));

  // instantiate service
  var loader, httpBackend;

  beforeEach(inject(function (httpLoader, $httpBackend) {
    loader = httpLoader;
    $httpBackend.when('GET','./../../data/data.json')
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
    httpBackend = $httpBackend;
  }));

  it('should load data', function () {
      var result;

      loader('./../../data/data.json')
          .then(function(response) {
              result = response.data;
          });
      httpBackend.flush();

      expect(result.length).toBe(4);
  });

});
