'use strict';

/**
 * @ngdoc directive
 * @name tagrefineryGuiApp.directive:d3Slider
 * @description
 * # d3Slider
 */
angular.module('tagrefineryGuiApp')
  .directive('d3Slider', ["d3", "$timeout", function (d3, $timeout) {
    function svgController() {
      var that = this;
      var svg, drag, x, bodyG, width, heigth, xAxis, formatCount, marker;

      that.init = function(element, scope)
      {
        scope.width = d3.select(element[0]).node().offsetWidth;

        width = scope.width - 40;
        heigth = scope.heigth - 20;

        formatCount = d3.format(",.3f");

        drag = d3.behavior.drag()
          .on("drag", dragMove)
          .on('dragend', dragEnd);

        function dragMove() {
          var current = Math.max(0, Math.min(width, d3.event.x));
          scope.data = current;

          marker.select(".outer")
            .attr("cx", current);

          marker.select(".inner")
            .attr("cx", current);

          d3.selectAll(".left")
            .attr("width", function(d) { return current; });

          d3.selectAll(".right")
            .attr("width", function(d) { return width - current; })
            .attr("x", function(d) { return current; });

          var leftOp = 1;
          var rightOp = 1;

          if(scope.data < width/2)
          {
            leftOp = 0;
            rightOp = 1;
            marker.select(".outer").classed({'right': true, 'left': false})
          }
          else
          {
            leftOp = 1;
            rightOp = 0;
            marker.select(".outer").classed({'right': false, 'left': true})
          }

          d3.selectAll(".leftlabel")
            .attr("opacity", leftOp)
            .attr("x", function(d) { return current - heigth - 5})
            .text(formatCount(x.invert(current)));

          d3.selectAll(".rightlabel")
            .attr("opacity", rightOp)
            .attr("x", function(d) { return current + heigth/2 + 5})
            .text(formatCount(x.invert(current)));
        }

        function dragEnd() {
          scope.callBack({value: x.invert(scope.data)});
        }

        svg = d3.select(element[0]).append("svg")
          .attr("width", scope.width)
          .attr("height", scope.heigth + 25);

        x = d3.scale.linear()
          .domain(scope.domain)
          .range([0, width]);

        xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", function () {
            return "translate(" + 20 + "," + (heigth + 10) + ")";
          })
          .call(xAxis);

        svg.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "middle")
          .attr("x", (width / 2))
          .attr("y", heigth + 40)
          .text(scope.xLabel);

        bodyG = svg.append('g')
          .attr("height", heigth)
          .attr("width", width)
          .attr('transform', 'translate(20, 10)');

        bodyG.append("rect")
          .attr("class", "left")
          .attr("y", 0)
          .attr("height", heigth)
          .on("click", function(d) {
            scope.data = d3.mouse(this)[0];
            scope.callBack({value: x.invert(scope.data)});
            that.render(scope);
          });

        bodyG.append("text")
          .attr("class","leftlabel value")
          .attr("y", heigth/2+5);

        bodyG.append("rect")
          .attr("class", "right")
          .attr("y", 0)
          .attr("height", heigth)
          .on("click", function(d) {
            scope.data = d3.mouse(this)[0];
            scope.callBack({value: x.invert(scope.data)});
            that.render(scope);
          });

        bodyG.append("text")
          .attr("class","rightlabel value")
          .attr("y", heigth/2+5)
          .text(function(d) { return formatCount(x.invert(scope.data)); });

        marker = bodyG.append("g")
          .attr("class", "marker")
          .call(drag);

        marker.append("circle")
          .attr("class", "outer")
          .attr("r", 20)
          .attr("cy", heigth/2);

        marker.append("circle")
          .attr("class", "inner")
          .attr("r", 10)
          .attr("cy", heigth/2)
          .attr("fill", "black");
      }

      that.render = function(scope)
      {
        marker.select(".outer")
          .attr("cx", scope.data);

        marker.select(".inner")
          .attr("cx", scope.data);

        d3.selectAll(".left")
          .transition()
          .duration(100)
          .attr("width", scope.data);

        d3.selectAll(".right")
          .transition()
          .duration(100)
          .attr("width", function(d) { return width - scope.data; })
          .attr("x", function(d) { return scope.data; });

        var leftOp = 1;
        var rightOp = 1;

        if(scope.data < width/2)
        {
          leftOp = 0;
          rightOp = 1;
          marker.select(".outer").classed({'right': true, 'left': false})
        }
        else
        {
          leftOp = 1;
          rightOp = 0;
          marker.select(".outer").classed({'right': false, 'left': true})
        }

        d3.selectAll(".leftlabel")
          .attr("opacity", leftOp)
          .transition()
          .attr("x", function(d) { return scope.data - heigth - 5})
          .text(formatCount(x.invert(scope.data)));

        d3.selectAll(".rightlabel")
          .attr("opacity", rightOp)
          .transition()
          .attr("x", function(d) { return scope.data + heigth/2 + 5})
          .text(formatCount(x.invert(scope.data)));
      }

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
        "domain": "=",
        callBack: '&'
      },
      //template: "<div></div>",
      link: function(scope, element, attrs, ctrl) {
        scope.heigth = parseInt(attrs.heigth) || 70;
        scope.xLabel = attrs.xlabel || "x-label";
        scope.data = 0;

        $timeout(function () {
          ctrl.init(element, scope);

          // Listeners
          // Watch for resize event
          scope.$watch(function () {
            return angular.element(window)[0].innerWidth;
          }, function (newVals) {
            if (newVals) {
              ctrl.render(scope);
            }
          });

          // Watch for external threshold changes and re-render
          scope.$watch('value', function (newVals) {
            if (newVals) {
              scope.data = ctrl.scale(newVals);
              ctrl.render(scope);
            }
          });
        },100)
      }
    }
  }]);
