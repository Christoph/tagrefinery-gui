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
      var svg, drag, x, bodyG, width, heigth, xAxis;

      this.init = function(element, scope) {

        width = scope.width - 40;
        heigth = scope.heigth - 20;

        var formatCount = d3.format(",.2f");

        // x-scale and axis
        x = d3.scale.linear()
          .domain(scope.domain)
          .range([0, width]);

        xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

        drag = d3.behavior.drag()
          .origin(Object)
          .on("drag", dragMove)
          .on('dragend', dragEnd);

        function dragMove(d) {

          var current = Math.max(0, Math.min(width, d3.event.x));

          d3.select(this)
            .attr("opacity", 0.6)
            .attr("cx", d.x = current);

          d3.selectAll(".left")
            .attr("width", function(d) { return d.x; });

          d3.selectAll(".right")
            .attr("width", function(d) { return width - d.x; })
            .attr("x", function(d) { return d.x; });

          var leftOp = 1;
          var rightOp = 1;

          if(d.x < width/2)
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
            .attr("x", function(d) { return d.x - heigth - 5})
            .text(formatCount(x.invert(current)));

          d3.selectAll(".rightlabel")
            .attr("opacity", rightOp)
            .attr("x", function(d) { return d.x + heigth/2 + 5})
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
          .data([{x: width/4}])
          .enter()
          .append('g')
          .attr("height", heigth)
          .attr("width", width)
          .attr('transform', 'translate(20, 10)');

        bodyG.append("rect")
          .attr("class", "left")
          .attr("y", 0)
          .attr("height", heigth)
          .attr("width", function(d) { return d.x; });

        bodyG.append("text")
          .attr("class","leftlabel value")
          .attr("x", function(d) { return d.x - heigth - 5})
          .attr("y", heigth/2+5);

        bodyG.append("rect")
          .attr("class", "right")
          .attr("y", 0)
          .attr("height", heigth)
          .attr("width", function(d) { return width - d.x; })
          .attr("x", function(d) { return d.x; });

        bodyG.append("text")
          .attr("class","rightlabel value")
          .attr("x", function(d) { return d.x + heigth/2 + 5})
          .attr("y", heigth/2+5)
          .text(function(d) { return formatCount(x.invert(d.x)); });

        bodyG.append("circle")
          .attr("r", heigth/2)
          .attr("cx", function(d) { return d.x; })
          .attr("cy", heigth/2)
          .attr("fill", "#2394F5")
          .call(drag);

      }

      this.render = function(scope) {
      }
    }
    return {
      restrict: "E",
      controller: svgController,
      scope: {
        "domain": "=",
        callBack: '&'
      },
      template: "<div></div>",
      link: function(scope, element, attrs, ctrl) {
        scope.width = parseInt(attrs.width) || 400;
        scope.heigth = parseInt(attrs.heigth) || 70;
        scope.xLabel = attrs.xlabel || "x-label";

        $timeout(function () {
          ctrl.init(element, scope);
        },100)
      }
    }
  }]);
