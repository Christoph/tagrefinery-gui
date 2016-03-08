'use strict';

/**
 * @ngdoc directive
 * @name tagrefineryGuiApp.directive:d3Hist
 * @description
 * # d3Hist
 */
angular.module('tagrefineryGuiApp')
  .directive('d3Hist', ["d3", "$timeout", function (d3, $timeout) {
    var basics = function (scope) {
      // Number formating
      scope.formatCount = d3.format(",.0f");

      // Custom x scaling function
      scope.xScaling = function () {
        scope.ticks = [];
        scope.dx = (scope.x.domain()[1] - scope.x.domain()[0]) / scope.binCount;

        // Define ticks
        for (var j = 0; j <= scope.binCount; j++) {
          scope.ticks.push(scope.x.domain()[0] + j * scope.dx);
        }
      };

      scope.yScaling = function () {
        // y sclaing
        var m = d3.max(scope.hist, function (d) {
          return d.y;
        });
        return [0, m + (m / 10)];
      };

      // Custom binning function
      scope.customHist = function (data) {
        scope.xScaling();

        var out = [];
        var temp = [];

        // Create histogram data
        for (var i = 0; i < scope.binCount; i++) {
          temp = _.sum(_.filter(data, function (d) {
            return d.value > scope.ticks[i] && d.value <= scope.ticks[i + 1];
          }), function (o) {
            return o.count;
          });

          out.push({
            dx: scope.dx,
            x: scope.ticks[i],
            y: temp
          });
        }

        return out;
      };

      scope.zoomed = function () {
        var t = d3.event.translate,
          s = d3.event.scale;

        t[0] = Math.min(0, Math.max(scope.quadrantWidth * (1 - s), t[0]));
        t[1] = Math.min(0, Math.max(scope.quadrantHeight * (1 - s), t[1]));

        scope.zoom.translate(t);

        render(scope);

        scope.svg.select(".x.axis").call(scope.xAxis);
        scope.svg.select(".y.axis").call(scope.yAxis);

        if(s > 1)
        {
          scope.$apply(function() {
            scope.isZoomed = true;
          })
        }
        else
        {
          scope.$apply(function() {
            scope.isZoomed = false;
          })
        }
      };

      scope.dragmove = function () {
        var x = d3.event.x;

        x = Math.max(0, Math.min(scope.quadrantWidth, x));

        if(scope.isFloat)
        {
          scope.threshold = scope.x.invert(x);
          scope.callBack({threshold: scope.x.invert(x)});
        }
        else
        {
          scope.threshold = Math.round(scope.x.invert(x));
          scope.callBack({threshold: Math.round(scope.x.invert(x))});
        }

        renderLine(scope);
      };

      // Bring element to front
      scope.bringToFront = function () {
        this.each(function () {
          this.parentNode.appendChild(this);
        });
      };

      scope.reset = function () {
        d3.transition().duration(750).tween("zoom", function () {
          var ix = d3.interpolate(scope.x.domain(), [0,scope.xDomain[1]]),
            iy = d3.interpolate(scope.y.domain(), scope.yDomain);
          return function (t) {
            scope.zoom.x(scope.x.domain(ix(t))).y(scope.y.domain(iy(t)));

            render(scope);
            scope.svg.select(".x.axis").call(scope.xAxis);
            scope.svg.select(".y.axis").call(scope.yAxis);
          };
        });
      }
    };

    var definitions = function (scope, element) {
      // width
      scope.width = d3.select(element).node().offsetWidth;

      scope.quadrantWidth = scope.width - scope.marginLeft - scope.margin;
      scope.quadrantHeight = scope.height - scope.margin - scope.margin;

      scope.xDomain = d3.extent(scope.data, function (d) {
        return d.value;
      });

      // x-scale and axis
      scope.x = d3.scale.linear()
        .domain(scope.xDomain).nice()
        .range([0, scope.quadrantWidth]);

      scope.xLine = d3.scale.linear()
        .domain([0, scope.quadrantWidth])
        .range([0, 1]);

      scope.xAxis = d3.svg.axis()
        .scale(scope.x)
        .tickValues(scope.ticks)
        .orient("bottom");

      // hist data
      scope.hist = scope.customHist(scope.data);

      // y-scale and axis
      scope.yDomain = scope.yScaling();

      scope.y = d3.scale.linear()
        .domain(scope.yDomain)
        .range([scope.quadrantHeight, 0]);

      scope.yAxis = d3.svg.axis()
        .scale(scope.y)
        .orient("left");

      //Define zoom behavior
      scope.zoom = d3.behavior.zoom()
        .x(scope.x)
        .y(scope.y)
        .scaleExtent([1, 1000])
        .size(scope.quadrantWidth, scope.quadrantHeight)
        .on("zoomstart", function() {
          scope.svg.style("cursor", "all-scroll")
        })
        .on("zoomend", function() {
          scope.svg.style("cursor", "zoom-in")
        })
        .on("zoom", scope.zoomed);

      // Define drag beavior
      scope.drag = d3.behavior.drag()
        .on("dragstart", function () {
          d3.event.sourceEvent.stopPropagation(); // silence other listeners
        })
        .on("drag", scope.dragmove);

    };

    var skeleton = function (scope, element) {
      var padding = 5;

      // SVG
      scope.svg = d3.select(element).append("svg")
        .attr("height", scope.height)
        .attr("width", '100%')
        .style("background-color", "white")
        .attr("class", "chart")
        .call(scope.zoom)
        .style("cursor", "zoom-in")
        .on('click', function () {
          if (d3.event.defaultPrevented) return; // click suppressed
          if(scope.isFloat)
          {
            scope.threshold = scope.x.invert(d3.mouse(this)[0] - scope.marginLeft);
          }
          else
          {
            scope.threshold = Math.round(scope.x.invert(d3.mouse(this)[0] - scope.marginLeft));
          }

          scope.callBack({threshold: scope.threshold});

          renderLine(scope);
        });

      // Detach dbl click from zoom
      scope.svg.on("dblclick.zoom", null);

      // title
      scope.svg.append("text")
        .attr("class", "hist-title")
        .attr("text-anchor", "middle")
        .attr("x", (scope.width / 2))
        .attr("y", 20)
        .text(scope.title);

      // x axis
      scope.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", function () {
          return "translate(" + scope.marginLeft + "," + (scope.height - scope.margin) + ")";
        })
        .call(scope.xAxis);

      // x axis label
      scope.svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", (scope.width / 2) + 25)
        .attr("y", scope.height - 2)
        .text(scope.xLabel);

      // y axis
      scope.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", function () {
          return "translate(" + scope.marginLeft + "," + scope.margin + ")";
        })
        .call(scope.yAxis);

      // y axis label
      scope.svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr("x", -(scope.height / 2))
        .attr("y", 5)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text(scope.yLabel);

      // body clip
      scope.svg.append("defs")
        .append("clipPath")
        .attr("id", "body-clip")
        .append("rect")
        .attr("x", 0 - 1.5 * padding)
        .attr("y", 0)
        .attr("width", scope.quadrantWidth + 3 * padding)
        .attr("height", scope.quadrantHeight);

      // create chart body
      scope.bodyG = scope.svg.append("g")
        .attr("class", "body")
        .attr("transform", "translate(" + scope.marginLeft + "," + scope.margin + ")")
        .attr("clip-path", "url(#body-clip)");

      // Threshold line and circle
      scope.marker = scope.bodyG
        .append("g")
        .attr("class", "threshold")
        .call(scope.drag);

      scope.marker
        .append("line")
        .style("cursor", "ew-resize")
        .attr("stroke", "black")
        .attr("stroke-width", 5)
        .attr("y1", 0)
        .attr("y2", scope.quadrantHeight);

      scope.marker
        .append("circle")
        .style("cursor", "ew-resize")
        .attr("r", 10)
        .attr("cy", scope.quadrantHeight/2);

      scope.markerArea = scope.bodyG
        .append("rect")
        .attr("class", "markerArea")
        .attr("height", scope.quadrantHeight)
    };

    var renderLine = function (scope) {
      if (scope.initialized) {
        scope.bodyG.selectAll(".threshold")
          .call(scope.bringToFront);

        scope.marker.select("line")
          .attr("x1", scope.x(scope.threshold))
          .attr("x2", scope.x(scope.threshold));

        scope.marker.select("circle")
          .attr("cx", scope.x(scope.threshold));

        if(scope.fromRight)
        {
          scope.markerArea
            .attr("x", scope.x(scope.threshold))
            .attr("width", function() {
              var w = scope.quadrantWidth - scope.x(scope.threshold);

              if(w > 0) return w;
              else return 0;
            });
        }
        else
        {
          scope.markerArea
            .attr("x",0)
            .attr("width", function() {
              var w = scope.x(scope.threshold);

              if(w > 0) return w;
              else return 0;
            });
        }
      }
    };

    var renderBars = function (scope) {
      // Update bins
      scope.hist = scope.customHist(scope.data);

      // Update line position
      renderLine(scope);

      // Enter
      scope.bar = scope.bodyG.selectAll(".bar")
        .data(scope.hist)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function (d) {
          return "translate(" + scope.x(d.x) + "," + scope.y(d.y) + ")";
        });

      scope.bar.append("text")
        .attr("dy", ".75em")
        .attr("y", -12)
        .attr("class", "barLabel")
        .attr("text-anchor", "left");

      scope.bodyG.selectAll(".barLabel")
        .call(scope.bringToFront);

      scope.bar.append("rect");

      // Update
      scope.bar = scope.bodyG.selectAll(".bar")
        .data(scope.hist)
        .transition()
        .duration(100)
        .attr("transform", function (d) {
          return "translate(" + scope.x(d.x) + "," + scope.y(d.y) + ")";
        });

      scope.bar.select("text")
        //.call(scope.bringToFront)
        .attr("x", scope.x(scope.hist[0].x) + 5)
        .text(function (d) {
          return scope.formatCount(d.y);
        });

      scope.bar.select("rect")
        .attr("x", 1)
        .attr("width", function() {
          var w = scope.x(scope.hist[0].x + scope.hist[0].dx) - 1;

          if(w > 0) return w;
          else return 0;
        })
        .attr("height", function (d) {
          var h = scope.quadrantHeight - scope.y(d.y);

          if(h > 0) return h;
          else return 0;
        });

      // Exit
      scope.bodyG.selectAll(".bar")
        .data(scope.hist)
        .exit()
        .remove();
    };

    var render = function (scope) {
      if (scope.initialized) {
        // Render data
        renderBars(scope);
      }
    };

    var init = function (scope, element) {
      // If we don't pass any data, return out of the element
      if (!scope.data.length) {
        console.log("No data");
        return;
      }

      // Initialze static variables and functions
      basics(scope, element[0]);

      // Basic definitions
      definitions(scope, element[0]);

      // Basic skeleton
      skeleton(scope, element[0]);

      scope.initialized = true;

      // Render data
      render(scope);

    };

    return {
      restrict: 'EA',
      transclude: true,
      scope: {
        data: '=',
        exThreshold: '=threshold',
        callBack: '&'
      },
      templateUrl: 'views/hist.html',
      link: function (scope, element, attrs) {
        // Get attributes or use defaults
        scope.margin = parseInt(attrs.margin) || 30;
        scope.marginLeft = parseInt(attrs.marginLeft) || 70;
        scope.height = parseInt(attrs.svgHeight) || 300;
        scope.xLabel = attrs.typeLabel || "";
        scope.yLabel = attrs.yLabel || "";
        scope.title = attrs.title || "";
        scope.binCount = parseInt(attrs.bins) || 16;
        var temp = attrs.isFloat || "true";
        scope.isFloat = temp == "true";
        temp = attrs.fromRight || "true";
        if(temp=="true") scope.fromRight = true;
        else scope.isFloat = false;

        scope.initialized = false;
        scope.isZoomed = false;
        scope.threshold = 0;

        // Rendering
        $timeout(function () {
          // Initial drawing
          init(scope, element);

          // Listeners
          // Watch for resize event
          scope.$watch(function () {
            return angular.element(window)[0].innerWidth;
          }, function (newVals) {
            if (newVals) {
              render(scope);
            }
          });

          // Watch for data changes and re-render
          scope.$watch('data', function (newVals) {
            if (newVals) {
              render(scope);
            }
          }, true);

          // Watch for external threshold changes and re-render
          scope.$watch('exThreshold', function (newVals) {
            if (newVals) {
              scope.threshold = newVals;
              renderLine(scope);
            }
            else if(newVals === 0)
            {
              scope.threshold = newVals;
              renderLine(scope);
            }
          });
        }, 100);
      }
    };
  }]);
