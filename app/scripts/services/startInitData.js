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
  .factory('startInitData', ["socket", "$q", function (socket, $q) {

    // Send data and parameter requests
    socket.emit("getRunning", "");
    socket.emit("getLoaded", "");

    // SocketIO call function with promise
    var calls = function(callback) {
      var deferred = $q.defer();

      socket.on(callback, function (data) {
        deferred.resolve(data);
      });

      return deferred.promise;
    };

    // Build initial data object
    return $q.all([
      calls("isRunning"),
      calls("isLoaded")
    ]).then(function(results){

      // Removes the socket listeners
      socket.removeAllListeners('isRunning');
      socket.removeAllListeners('isLoaded');

      // Returns the data
        return {
          running: results[0],
          loaded: results[1]
        };
    },function() {
      console.log("No start view data.");

      socket.removeAllListeners('isRunning');
      socket.removeAllListeners('isLoaded');
    });

  }]);
