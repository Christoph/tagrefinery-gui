'use strict';

/**
 * @ngdoc directive
 * @name tagrefineryGuiApp.directive:d3SimHist
 * @description
 * # d3SimHist
 */
angular.module('tagrefineryGuiApp')
    .directive('d3SimHist', ["d3", "$timeout", function (d3, $timeout) {
        var margin, marginLeft;
        var width, height, xScale, yScale, xAxis, yAxis;
        var quadrantWidth, quadrantHeight;
        var hist, svg, bodyG;
        var xLabel, yLabel, title, binCount, attribute;
        var initialized = false;
        var dirty = false;

        var formatCount = d3.format(",.0f");

        var toggleClass = function(element, className) {
            bodyG.selectAll(".bar.select")
                .classed(className, false);
                
            d3.select(element)
                .classed(className, function () {
                    return !d3.select(element).classed(className);
                });
        };

        var customHist = function(data,filter)
        {
            var ticks = [];
            var dx = (filter[1] - filter[0])/binCount;
            var out = [];
            var temp = [];

            // Define ticks
            for(var j = 0; j <= binCount; j++)
            {
                ticks.push(filter[0] + j * dx);
            }

            // Create histogram data
            for(var i = 0; i < binCount; i++)
            {
                temp = _.sumBy(_.filter(data, function(d) {
                    return d.value > ticks[i] && d.value <= ticks[i+1];
                }),function(o) { return o.count; });

                out.push({
                    dx: filter[0]+dx,
                    x: ticks[i],
                    y: temp
                });
            };

            return out;
        };

        var definitions = function(data, filter)
        {
            quadrantWidth = width - marginLeft - margin;
            quadrantHeight = height - margin -margin;

            // x-scale and axis
            xScale = d3.scale.linear()
                //.domain([0,d3.max(data, function(d) { return d[attribute]; })]).nice()
                .domain(filter)
                .range([0, quadrantWidth]);

            xAxis = d3.svg.axis()
                .scale(xScale)
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

        var skeleton = function(element)
        {
            var padding = 5;

            // SVG
            svg = d3.select(element).append("svg")
                .attr("height", height)
                .attr("width", '100%')
                .style("background-color", "white")
                .attr("class", "chart");

            // title
            svg.append("text")
                .attr("class", "title")
                .attr("text-anchor", "middle")
                .attr("x",(width/2))
                .attr("y", 20)
                .text(title);

            // x axis
            svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", function () {
                        return "translate(" + marginLeft + "," + (height - margin) + ")";
                    })
                    .call(xAxis);

            // x axis label
            svg.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "middle")
                .attr("x",(width/2)+25)
                .attr("y", height - 2)
                .text(xLabel);

            // y axis
            svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", function () {
                        return "translate(" + marginLeft + "," + margin + ")";
                    })
                    .call(yAxis);

            // y axis label
            svg.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "middle")
                .attr("x",-(height/2))
                .attr("y", 5)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .text(yLabel);
            
            // body clip
            svg.append("defs")
                    .append("clipPath")
                    .attr("id", "body-clip")
                    .append("rect")
                    .attr("x", 0 - 1.5 * padding)
                    .attr("y", 0)
                    .attr("width", quadrantWidth + 3 * padding)
                    .attr("height", quadrantHeight);

            // create chart body
            bodyG = svg.append("g")
                    .attr("class", "body")
                    .attr("transform", "translate(" + marginLeft + "," + margin + ")")
                    .attr("clip-path", "url(#body-clip)");
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
                    //toggleClass(this,"select");
                    return scope.onClick({filter: [d.x, d.x + d.dx]});
                });

            bar.append("rect");

            bar.append("text")
                .attr("dy", ".75em")
                .attr("y", -12)
                .attr("text-anchor", "left");

            // Update
            bar = bodyG.selectAll(".bar")
                .data(hist)
                .transition()
                .duration(500)
                .attr("transform", function(d) { return "translate("+xScale(d.x)+","+yScale(d.y)+")"; });

            bar.select("rect")
                .attr("x", 1)
                .attr("width", xScale(hist[0].dx) - 1)
                .attr("height", function(d) { return quadrantHeight - yScale(d.y); });
                
            bar.select("text")
                .attr("x", xScale(hist[0].dx) / 2 - 18)
                .text(function(d) { return formatCount(d.y); });

            // Exit
            bodyG.selectAll(".bar")
                .data(hist)
                .exit()
                .remove();
        };

        var render = function(scope)
        {
            if(initialized && dirty)
            {
                // Render data
                renderBars(scope);
                dirty = false;
            }
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
            definitions(scope.data, scope.filter);

            // Basic skeleton
            skeleton(element[0]);
            
            // Render data
            renderBars(scope);

            initialized = true;
        };

        var useFilter = function(scope)
        {
            // Apply filter
            var filtered = _.filter(scope.data, function(d) {
                return d.value > scope.filter[0] && d.value <= scope.filter[1];
            });

            // Update definitions
            definitions(filtered, scope.filter);

            // Update both axis
            var temp = svg.selectAll(".x.axis")
                .call(xAxis);

            var temp = svg.selectAll(".y.axis")
                .call(yAxis);
        }

        return {
            restrict: 'EA',
            scope: {
                data: '=',
                onClick: '&',
                filter: '='
            },
            link: function (scope, element, attrs) {
                // Get attributes or use defaults
                margin = parseInt(attrs.margin) || 30;
                marginLeft = parseInt(attrs.marginLeft) || 70;
                height = parseInt(attrs.svgHeight) || 200;
                xLabel = attrs.typeLabel || "";
                yLabel = attrs.yLabel || "";
                title = attrs.title || "";
                attribute = attrs.attribute || "";
                binCount = parseInt(attrs.bins) || 30;
                
                $timeout(function() {
                    // width
                    width = d3.select(element[0]).node().offsetWidth;

                    // Initial drawing
                    init(scope, element);

                    // Listeners
                    // Watch for filtering
                    scope.$watch('filter', function(newVals) {
                        if(newVals)
                        {
                            dirty = true;
                            useFilter(scope);
                            render(scope);
                        }
                    });

                    // Watch for resize event
                    scope.$watch(function() {
                        return angular.element(window)[0].innerWidth;
                        }, function(newVals) {
                        if(newVals)
                        {
                            dirty = true;
                            render(scope);
                        }
                    });

                    // Watch for data changes and re-render
                    scope.$watch('data', function(newVals) {
                        if(newVals)
                        {
                            dirty = true;
                            render(scope);
                        }
                    },true);
                }, 200);
            }
        };
}]);
