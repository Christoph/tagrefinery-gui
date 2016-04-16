'use strict';
/* jshint -W117 */

/**
 * @ngdoc service
 * @name tagrefineryGuiApp.socketio
 * @description
 * # socket
 * Factory in the tagrefineryGuiApp.
 */
angular.module('tagrefineryGuiApp')
  .factory('socket', ["socketFactory", function (socketFactory) {
    return socketFactory({
      ioSocket: io.connect('http://localhost:9092', {
      reconnection: true,
      timeout: 10000,
      'reconnectionAttempts': 10
      })
    })
  }]);
