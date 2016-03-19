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
      var svg, x, bodyG, width, height, xAxis;

      that.init = function(element, scope)
      {
        scope.width = d3.select(element[0]).node().offsetWidth;

        width = scope.width - 10;
        height = scope.height ;

        svg = d3.select(element[0]).append("svg")
          .attr("width", scope.width)
          .attr("height", height);

        x = d3.scale.linear()
          .domain(scope.domain)
          .range([0, width]);

        bodyG = svg.append('g')
          .attr("height", height)
          .attr("width", width)
          .attr('transform', 'translate(5,0)');

        bodyG.append("rect")
          .attr("class", "left")
          .attr("y", 0)
          .attr("width", x(scope.value))
          .attr("height", height);

        bodyG.append("rect")
          .attr("class", "right")
          .attr("y", 0)
          .attr("width", function () {
            return width - x(scope.value);
          })
          .attr("x", function () {
            return x(scope.value);
          })
          .attr("height", height);

      };

      that.update = function(scope)
      {
        bodyG.selectAll(".left")
          .attr("width", x(scope.value));

        bodyG.selectAll(".right")
          .attr("width", function () {
            return width - x(scope.value);
          })
          .attr("x", function () {
            return x(scope.value);
          });
      };

      that.scale = function(value)
      {
        return x(value);
      }
    }
    return {
      restrict: "A",
      controller: svgController,
      scope: {
        "value": "=",
        "domain": "="
      },
      link: function(scope, element, attrs, ctrl) {
        scope.height = parseInt(attrs.height) || 20;

        $timeout(function () {
          ctrl.init(element, scope);

          // Listeners

          // Watch for external threshold changes and re-render
          scope.$watch('value', function (newVals) {
            if (newVals) {
              ctrl.update(scope);
            }
          });
        },100)
      }
    }
  }]);
