'use strict';

describe('Service: intros', function () {

  // load the service's module
  beforeEach(module('tagrefineryGuiApp'));

  // instantiate service
  var intros;
  beforeEach(inject(function (_intros_) {
    intros = _intros_;
  }));

  it('should do something', function () {
    expect(!!intros).toBe(true);
  });

});
