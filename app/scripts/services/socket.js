'use strict';
/* jshint -W117 */

/**
 * @ngdoc service
 * @name tagrefineryGuiApp.socket
 * @description
 * # socket
 * Factory in the tagrefineryGuiApp.
 */
angular.module('tagrefineryGuiApp')
  .factory('socket', ["$rootScope", function ($rootScope) {

        var socketio = io.connect('http://localhost:9092',{
            reconnection: false,
        });

      var onEvent = function (e, callback) {
           socketio.on(e, function() {
var args = arguments; $rootScope.$apply(function() {
callback.apply(socketio, args); });
}); };
      
      var emitEvent = function (e, data, callback) {
           socketio.emit(e, data, function() {
var args = arguments; $rootScope.$apply(function() {
               if (callback) {
                 callback.apply(socketio, args);
} });
}); };

      return {
          on: onEvent,
          emit: emitEvent
      };

  }]);
