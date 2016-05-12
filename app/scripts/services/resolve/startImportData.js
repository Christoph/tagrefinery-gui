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
  .factory('startImportData', ["socket", "$q", function (socket, $q) {
    return {
      get: function() {
        // Send data and parameter requests
        socket.emit("getStartImportData", "");
        socket.emit("getLoaded", "");

        console.log("factory")

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
          calls("isStartImportData"),
          calls("isLoaded")
        ]).then(function(results){
          // Removes the socket listeners
          socket.removeAllListeners('isStartImportData');
          socket.removeAllListeners('isLoaded');

          // Returns the data
          return {
            data: results[0],
            loaded: results[1]
          };
        },function() {
          console.log("No data.");

          socket.removeAllListeners('isStartImportData');
          socket.removeAllListeners('isLoaded');
        });
      }
  }

  }]);
