'use strict';

/**
 * @ngdoc directive
 * @name tagrefineryGuiApp.directive:d3Hist
 * @description
 * # d3Hist
 */
angular.module('tagrefineryGuiApp')
  	.directive('d3Hist', ["d3", "$timeout", function (d3, $timeout) {
        var margin, marginLeft;
        var width, height, xScale, yScale, xAxis, yAxis;
        var quadrantWidth, quadrantHeight;
        var hist, bodyG, ticks, dx;
        var zoomFunc;
        var xLabel, yLabel, title, binCount, attribute = "value";
        var brush, gBrush;
        var initialized = false;
        var filterHistory = [];
        var allowBack = false;

        var formatCount = d3.format(",.0f");

        var xScaling = function(filter)
        {
            ticks = [];
            dx = (filter[1] - filter[0])/binCount;
            
            // Define ticks
            for(var j = 0; j <= binCount; j++)
            {
                ticks.push(filter[0] + j * dx);
            }
        };

        var customHist = function(data,filter)
        {
            var out = [];
            var temp = [];

            // Create histogram data
            for(var i = 0; i < binCount; i++)
            {
                temp = _.sum(_.filter(data, function(d) {
                    return d.value > ticks[i] && d.value <= ticks[i+1];
                }),function(o) { return o.count; });

                out.push({
                    dx: dx,
                    x: ticks[i],
                    y: temp
                });
            };

            return out;
        };

        // Brush functions
        //
        // Creates the nice drag handle
        function resizePath(d) {
            var e = +(d == "e"),
                x = e ? 1 : -1,
                y = quadrantHeight / 3;
            return "M" + (.5 * x) + "," + y
                + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
                + "V" + (2 * y - 6)
                + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
                + "Z"
                + "M" + (2.5 * x) + "," + (y + 8)
                + "V" + (2 * y - 8)
                + "M" + (4.5 * x) + "," + (y + 8)
                + "V" + (2 * y - 8);
        };
        
        // Histogram bin size round function
        function round(number, increment, offset) {
            return Math.round((number - offset) / increment ) * increment + offset;
        };

        function brushended() {
          if (!d3.event.sourceEvent) return; // only transition after input

          var xDomain = xScale.domain();

          var extent0 = brush.extent();
          var extent1 = extent0.map(function(d) { 
              return round(d,dx,xDomain[0]) 
          });

          // If selection is empty, clear filter
          if ((extent1[1] - extent1[0]) < dx) {
              // Remove brush
              extent1[1] = extent1[0];
              brush.clear();
          }
          else
          {
              // Filter
              zoomFunc([extent1[0], extent1[1]]);

              // Remove brush
              brush.clear();
              d3.selectAll('.brush').call(brush);

          }

          // Transition
          /*
          d3.select(this).transition()
              .call(brush)
              .call(brush.event);
              */
        };

        // Update while brushing
        function brushing()
        {
            if (!d3.event.sourceEvent) return; // only transition after input
        };

        var definitions = function(data, filter, element)
        {
            // width
            width = d3.select(element[0]).node().offsetWidth;

            quadrantWidth = width - marginLeft - margin;
            quadrantHeight = height - margin -margin;

            // Create ticks and dx
            xScaling(filter);

            // x-scale and axis
            xScale = d3.scale.linear()
                .domain(filter)
                .range([0, quadrantWidth]);

            xAxis = d3.svg.axis()
                .scale(xScale)
                .tickValues(ticks)
                .orient("bottom");
            
            // hist data
            hist = customHist(data,filter);

            // y-scale and axis
            var m = d3.max(hist, function(d) { return d.y; });
            
            yScale = d3.scale.linear()
                .domain([0, m+(m/10)])
                .range([quadrantHeight,0]);

            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");            
        };

        var skeleton = function(scope, element)
        {
            var padding = 5;

            // SVG
            scope.svg = d3.select(element).append("svg")
                .attr("height", height)
                .attr("width", '100%')
                .style("background-color", "white")
                .attr("class", "chart");

            // title
            scope.svg.append("text")
                .attr("class", "title")
                .attr("text-anchor", "middle")
                .attr("x",(width/2))
                .attr("y", 20)
                .text(title);

            // x axis
            scope.svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", function () {
                        return "translate(" + marginLeft + "," + (height - margin) + ")";
                    })
                    .call(xAxis);

            // x axis label
            scope.svg.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "middle")
                .attr("x",(width/2)+25)
                .attr("y", height - 2)
                .text(xLabel);

            // y axis
            scope.svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", function () {
                        return "translate(" + marginLeft + "," + margin + ")";
                    })
                    .call(yAxis);

            // y axis label
            scope.svg.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "middle")
                .attr("x",-(height/2))
                .attr("y", 5)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .text(yLabel);
            
            // body clip
            scope.svg.append("defs")
                    .append("clipPath")
                    .attr("id", "body-clip")
                    .append("rect")
                    .attr("x", 0 - 1.5 * padding)
                    .attr("y", 0)
                    .attr("width", quadrantWidth + 3 * padding)
                    .attr("height", quadrantHeight);

            // create chart body
            bodyG = scope.svg.append("g")
                    .attr("class", "body")
                    .attr("transform", "translate(" + marginLeft + "," + margin + ")")
                    .attr("clip-path", "url(#body-clip)");

            brush = d3.svg.brush()
                .x(xScale)
                .on("brush", brushing)
                .on("brushend", brushended);

            gBrush = bodyG.append("g")
                .attr("class","brush")
                .call(brush)
                .call(brush.event);

            gBrush.selectAll("rect")
                .attr("rx", 5)
                .attr("height", quadrantHeight)
                .attr("y", 1);

            gBrush.selectAll(".resize").append("path").attr("d", resizePath);
        };

        var renderBars = function(scope) {
            // Enter
            var bar = bodyG.selectAll(".bar")
                .data(hist)
                .enter()
                .append("g")
                .attr("class","bar")
                .attr("transform", function(d) { return "translate("+xScale(d.x)+","+yScale(d.y)+")"; })
                .on('click', function(d) {
                    return zoomFunc([d.x, d.x + d.dx]);
                });

            bar.append("text")
                .attr("dy", ".75em")
                .attr("y", -12)
                .attr("text-anchor", "left");

            bar.append("rect");

            // Update
            bar = bodyG.selectAll(".bar")
                .data(hist)
                .transition()
                .duration(500)
                .attr("transform", function(d) { return "translate("+xScale(d.x)+","+yScale(d.y)+")"; });

            bar.select("text")
                //.attr("x", xScale(hist[0].x+hist[0].dx) / 2 - 18)
                .attr("x", xScale(hist[0].x)  + 5)
                .text(function(d) { return formatCount(d.y); });

            bar.select("rect")
                .attr("x", 1)
                .attr("width", xScale(hist[0].x+hist[0].dx) - 1)
                .attr("height", function(d) { return quadrantHeight - yScale(d.y); });
                
            // Exit
            bodyG.selectAll(".bar")
                .data(hist)
                .exit()
                .remove();
        };

        var render = function(scope)
        {
            if(initialized)
            {
                // Render data
                renderBars(scope);
            }
        };

        var resize = function(scope, element)
        {
            var padding = 5;

            definitions(scope.data, scope.filter, element);

            scope.svg.selectAll(".title")
                .attr("x",(width/2));

            scope.svg.selectAll(".x.axis")
                    .call(xAxis);

            scope.svg.selectAll(".x.label")
                .attr("x",(width/2)+25);

            scope.svg.selectAll("#body-clip rect")
                    .attr("width", quadrantWidth + 3 * padding);

            scope.svg.selectAll(".body")
                    .attr("transform", "translate(" + marginLeft + "," + margin + ")")
                    .attr("clip-path", "url(#body-clip)");

            brush.x(xScale);

        };

        var init = function(scope, element)
        {
            // If we don't pass any data, return out of the element
            if (!scope.data.length) 
            {
                console.log("No data");
                return;
            }

            // Basic definitions
            definitions(scope.data, scope.filter, element);

            // Basic skeleton
            skeleton(scope, element[0]);
            
            // Render data
            renderBars(scope);

            initialized = true;
            console.log("Hist Initialized")
        };

        var useFilter = function(scope, element)
        {
            // Apply filter
            var filtered = _.filter(scope.data, function(d) {
                return d.value > scope.filter[0] && d.value <= scope.filter[1];
            });

            // Update definitions
            definitions(filtered, scope.filter, element);

            if(initialized)
            {
                // Update both axis
                scope.svg.selectAll(".x.axis").call(xAxis);
                scope.svg.selectAll(".y.axis").call(yAxis);

                // Update brush axis
                brush.x(xScale);
            }
        }

        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                data: '=',
                filter: '='
            },
            templateUrl: 'templates/hist.html',
            link: function (scope, element, attrs) {
                // Get attributes or use defaults
                margin = parseInt(attrs.margin) || 30;
                marginLeft = parseInt(attrs.marginLeft) || 70;
                height = parseInt(attrs.svgHeight) || 300;
                xLabel = attrs.typeLabel || "";
                yLabel = attrs.yLabel || "";
                title = attrs.title || "";
                binCount = parseInt(attrs.bins) || 16;

                // Zooming functionality
                zoomFunc = function(extend) {
                    // Save old filter
                    filterHistory.push(scope.filter);
                    // Set new one
                    scope.filter = extend;
                    // Active back button
                    allowBack = true;

                    // Redraw
                    useFilter(scope, element);
                    render(scope);
                };

                // Map functions to the buttons
                scope.back = function() {
                    if(filterHistory.length > 0)
                    {
                        scope.filter = filterHistory.pop();
                        useFilter(scope, element);
                        render();
                    }

                    if(filterHistory.length == 0)
                    {
                        allowBack = false;
                    }
                }

                scope.reset = function() {
                    scope.filter = [0,1];
                    filterHistory = [];

                    allowBack = false;

                    useFilter(scope, element);
                    render();
                }

                scope.history = function() {
                    return allowBack;
                }

                // Rendering
                $timeout(function() {
                    // Initial drawing
                    init(scope, element);

                    // Listeners
                    // Watch for resize event
                    scope.$watch(function() {
                        return angular.element(window)[0].innerWidth;
                        }, function(newVals) {
                        if(newVals)
                        {
                            if(initialized == true) 
                            {
                                resize(scope, element);   
                            }

                            render(scope);
                        }
                    });

                    // Watch for data changes and re-render
                    scope.$watch('data', function(newVals) {
                        if(newVals)
                        {
                            //if(initialized == false) init(scope, element);

                            render(scope);
                        }
                    },true);
                }, 0);
            }
        };
}]);
