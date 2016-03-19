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

      };

      that.update = function(scope)
      {
        console.log(scope.value)
        bodyG.selectAll(".leftCell")
          .attr("width", x(scope.value));

        bodyG.selectAll(".rightCell")
          .attr("width", function () {
            return width - x(scope.value);
          })
          .attr("x", function () {
            return x(scope.value);
          });
      };
    }
    return {
      restrict: "A",
      controller: svgController,
      scope: {
        "value": "@",
        "domain": "="
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
        },100)
      }
    }
  }]);
