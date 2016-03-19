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
        scope.height = d3.select(element[0]).node().offsetHeight;

        width = scope.width - 20;
        height = scope.height - 20;

        svg = d3.select(element[0]).append("svg")
          .attr("width", scope.width)
          .attr("height", scope.height);

        x = d3.scale.linear()
          .domain(scope.domain)
          .range([0, width]);

        xAxis = d3.svg.axis()
          .scale(x)
          .ticks(2)
          .orient("bottom");

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", function () {
            return "translate(" + 10 + "," + (height) + ")";
          })
          .call(xAxis);

        svg.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "middle")
          .attr("x", (width / 2))
          .attr("y", height);

        bodyG = svg.append('g')
          .attr("height", height)
          .attr("width", width)
          .attr('transform', 'translate(10,0)');

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
        $timeout(function () {
          ctrl.init(element, scope);

          // Listeners
          // Watch for resize event
          scope.$watch(function () {
            return angular.element(window)[0].innerWidth;
          }, function (newVals) {
            if (newVals) {
            }
          });
        },100)
      }
    }
  }]);
