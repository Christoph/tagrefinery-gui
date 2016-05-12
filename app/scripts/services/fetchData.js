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
  .factory('fetchData', ["socket", "$q", function (socket, $q) {
    return {
      get: function (events) {
        var totalCalls = [];

        // SocketIO call function with promise
        var calls = function (callback) {
          var deferred = $q.defer();

          socket.on(callback, function (data) {
            deferred.resolve(data);
          });

          return deferred.promise;
        };

        _.forEach(events, function(d) {
          // Send data and parameter requests
          socket.emit("get"+d, "");

          // Create promises array
          totalCalls.push(calls("is"+d));
        });

        // Build initial data object
        return $q.all(totalCalls)
          .then(function (results) {
            var data = {};
            var temp = [];

            _.forEach(events, function(d, key) {
              // Removes the socket listeners
              socket.removeAllListeners("is"+d);

              // Build return object
              data[d] = results[key];
            });

            // Returns the data
            return data;
          }, function () {
            console.log("No data.");

            _.forEach(events, function(d, key) {
              // Removes the socket listeners
              socket.removeAllListeners("is"+d);
            });
          });
      }
    }
  }]);
