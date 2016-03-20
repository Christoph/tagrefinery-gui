'use strict';

/**
 * @ngdoc directive
 * @name tagrefineryGuiApp.directive:d3Bar
 * @description
 * # d3Bar
 */
angular.module('tagrefineryGuiApp')
  .directive('d3Bar', ["d3", "$timeout", function (d3, $timeout) {
    function svgController() {
      var that = this;
      var svg, x, bodyG, width, height;

      that.init = function(element, scope)
      {
        scope.width = d3.select(element[0]).node().offsetWidth;

        width = scope.width;
        height = scope.height ;

        svg = d3.select(element[0]).append("svg")
          .attr("width", width)
          .attr("height", height);

        x = d3.scale.linear()
          .domain(scope.domain)
          .range([0, width]);

        bodyG = svg.append('g')
          .attr("height", height)
          .attr("width", width)
          .attr('transform', 'translate(0,0)');

        bodyG.append("rect")
          .attr("class", "leftCell")
          .attr("y", 0)
          .attr("width", x(scope.value))
          .attr("height", height);

        bodyG.append("rect")
          .attr("class", "rightCell")
          .attr("y", 0)
          .attr("width", function () {
            return width - x(scope.value);
          })
          .attr("x", function () {
            return x(scope.value);
          })
          .attr("height", height);

        bodyG.append("line")
          .attr("stroke", "white")
          .attr("stroke-width", 2)
          .attr("class", "innerMarker")
          .attr("x1", x(scope.marker))
          .attr("x2", x(scope.marker))
          .attr("y1", 0)
          .attr("y2", height);
      };

      that.update = function(scope)
      {
        bodyG.selectAll(".leftCell")
          .attr("width", x(scope.value));

        bodyG.selectAll(".rightCell")
          .attr("width", function () {
            return width - x(scope.value);
          })
          .attr("x", function () {
            return x(scope.value);
          });

        bodyG.selectAll(".innerMarker")
          .attr("x1", x(scope.marker))
          .attr("x2", x(scope.marker))

      };
    }
    return {
      restrict: "A",
      controller: svgController,
      scope: {
        "value": "@",
        "domain": "=",
        "marker": "@"
      },
      link: function(scope, element, attrs, ctrl) {
        scope.height = parseInt(attrs.height) || 20;
        scope.width = parseInt(attrs.width) || 100;

        $timeout(function () {
          ctrl.init(element, scope);

          // Listeners
          // Watch for external threshold changes and re-render
          scope.$watch('value', function (newVals) {
            if (newVals) {
              ctrl.update(scope);
            }
          });

          scope.$watch('marker', function (newVals) {
            if (newVals) {
              ctrl.update(scope);
            }
          });
        },100)
      }
    }
  }]);
