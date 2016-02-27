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
      var svg, drag, x, bodyG, width, heigth, xAxis, formatCount;

      this.init = function(element, scope)
      {
        scope.width = d3.select(element[0]).node().offsetWidth;

        width = scope.width - 40;
        heigth = scope.heigth - 20;

        formatCount = d3.format(",.2f");

        drag = d3.behavior.drag()
          .on("drag", dragMove)
          .on('dragend', dragEnd);

        function dragMove(d) {

          var current = Math.max(0, Math.min(width, d3.event.x));

          d3.select(this)
            .attr("opacity", 0.6)
            .attr("cx", current);

          d3.selectAll(".left")
            .attr("width", function(d) { return current; });

          d3.selectAll(".right")
            .attr("width", function(d) { return width - current; })
            .attr("x", function(d) { return current; });

          var leftOp = 1;
          var rightOp = 1;

          if(current < width/2)
          {
            leftOp = 0;
            rightOp = 1;
          }
          else
          {
            leftOp = 1;
            rightOp = 0;
          }

          d3.selectAll(".leftlabel")
            .attr("opacity", leftOp)
            .attr("x", function(d) { return current - heigth - 5})
            .text(formatCount(x.invert(current)));

          d3.selectAll(".rightlabel")
            .attr("opacity", rightOp)
            .attr("x", function(d) { return current + heigth/2 + 5})
            .text(formatCount(x.invert(current)));

          scope.callBack({value: x.invert(current)});
        }

        function dragEnd() {
          d3.select(this)
            .attr('opacity', 1)
        }

        svg = d3.select(element[0]).append("svg")
          .attr("width", scope.width)
          .attr("height", scope.heigth + 25);
      }

      this.render = function(scope)
      {
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

        bodyG = svg.selectAll(".body")
          .data(scope.data)
          .enter()
          .append('g')
          .attr("height", heigth)
          .attr("width", width)
          .attr('transform', 'translate(20, 10)');

        bodyG.append("rect")
          .attr("class", "left")
          .attr("y", 0)
          .attr("height", heigth);

        bodyG.append("text")
          .attr("class","leftlabel value")
          .attr("y", heigth/2+5);

        bodyG.append("rect")
          .attr("class", "right")
          .attr("y", 0)
          .attr("height", heigth);

        bodyG.append("text")
          .attr("class","rightlabel value")
          .attr("y", heigth/2+5)
          .text(function(d) { return formatCount(x.invert(d.x)); });

        bodyG.append("circle")
          .attr("class", "barmarker")
          .attr("r", 20)
          .attr("cy", heigth/2)
          .attr("fill", "black")
          .call(drag);

        this.line(scope);
      }

      this.line = function(scope)
      {
        svg.selectAll(".body")
          .data(scope.data);

        d3.selectAll(".barmarker")
          .transition()
          .attr("cx", scope.data.x);

        d3.selectAll(".left")
          .transition()
          .attr("width", scope.data.x);

        d3.selectAll(".right")
          .transition()
          .attr("width", function(d) { return width - scope.data.x; })
          .attr("x", function(d) { return scope.data.x; });

        var leftOp = 1;
        var rightOp = 1;

        if(scope.data.x < width/2)
        {
          leftOp = 0;
          rightOp = 1;
        }
        else
        {
          leftOp = 1;
          rightOp = 0;
        }

        d3.selectAll(".leftlabel")
          .attr("opacity", leftOp)
          .transition()
          .attr("x", function(d) { return scope.data.x - heigth - 5})
          .text(formatCount(x.invert(scope.data.x)));

        d3.selectAll(".rightlabel")
          .attr("opacity", rightOp)
          .transition()
          .attr("x", function(d) { return scope.data.x + heigth/2 + 5})
          .text(formatCount(x.invert(scope.data.x)));
      }

      this.scale = function(value)
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
        scope.data = [{x: 0}];

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
              scope.data.x = ctrl.scale(newVals);
              ctrl.render(scope);
            }
          });
        },100)
      }
    }
  }]);
