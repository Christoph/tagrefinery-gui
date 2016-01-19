'use strict';

/**
 * @ngdoc directive
 * @name tagrefineryGuiApp.directive:d3Bars
 * @description
 * # d3Bars
 */
angular.module('tagrefineryGuiApp')
    .directive('d3Bars', ["d3", "$timeout", function (d3, $timeout) {
        var margin, marginLeft, isActive;
        var width, height, color, xScale, yScale, xAxis, yAxis;
        var quadrantWidth, quadrantHeight;
        var hist, svg, bodyG;
        var xName, yName;

        var formatCount = d3.format(",.0f");

        var definitions = function(data)
        {
            quadrantWidth = width - marginLeft - margin;
            quadrantHeight = height - margin -margin;

            // x-scale and axis
            xScale = d3.scale.linear()
                .domain([0,d3.max(data, function(d) { return d.importance; })]).nice()
                .range([0, quadrantWidth]);

            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");
            
            // hist data
            hist = d3.layout.histogram()
                .bins(20)
                (data.map(function(d) { return d.importance; }));

            // y-scale and axis
            var m = d3.max(hist, function(d) { return d.y; });
            
            yScale = d3.scale.linear()
                .domain([0, m+(m/10)])
                .range([quadrantHeight,0]);

            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");            

        };

        var skeleton = function(element,data)
        {
            var padding = 5;

            // SVG
            svg = d3.select(element).append("svg")
                .attr("height", height)
                .attr("width", '100%')
                .style("background-color", "white")
                .attr("class", "chart");
                //.on("brush", _reloadAll);

            // title
            svg.append("text")
                .attr("class", "title")
                .attr("text-anchor", "middle")
                .attr("x",(width/2))
                .attr("y", 20)
                .text("Title");

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
                .attr("x",(width/2))
                .attr("y", height - 2)
                .text("["+xName+"]");

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
                .text("["+yName+"]");
            
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
                    .attr("transform", "translate(" 
                            + marginLeft 
                            + "," 
                            + margin + ")")
                    .attr("clip-path", "url(#body-clip)");
            
                       
            // create brush
            /*
            _brush = d3.svg.brush()
                .x(_x)
                .on("brush", brushing)
                .on("brushend", brushended);

            _gBrush = _bodyG.append("g")
                .attr("class", "brush")
                .call(_brush)
                .call(_brush.event);

            _gBrush.selectAll("rect")
                .attr("rx", 5)
                .attr("height", quadrantHeight())
                .attr("y", 1);

            _gBrush.selectAll(".resize").append("path").attr("d", resizePath);
            */

        };

        var renderBars = function(element, data) {
            // Enter
            var bar = bodyG.selectAll(".bar")
                .data(hist)
                .enter()
                .append("g")
                .attr("class","bar")
                .attr("transform", function(d) { return "translate("+xScale(d.x)+","+yScale(d.y)+")"; });

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
                .attr("x", xScale(hist[0].dx) / 2 - 6)
                .text(function(d) { return formatCount(d.y); });

            // Exit
            bodyG.selectAll(".bar")
                .data(hist)
                .exit()
                .remove();
        };

        var render = function(element, data)
        {
            // If we don't pass any data, return out of the element
            if (!data.length) 
            {
                console.log("No data");
                return;
            }

            if(!svg)
            {
                // Basic definitions
                definitions(data);

                // Basic skeleton
                skeleton(element[0],data);
            }

            // Render data
            renderBars(element, data);
        }

        return {
            restrict: 'EA',
            scope: {
                data: '=',
                onClick: '&'
            },
            link: function (scope, element, attrs) {
                // Get attributes or use defaults
                margin = parseInt(attrs.margin) || 30;
                marginLeft = parseInt(attrs.marginLeft) || 70;
                height = parseInt(attrs.svgHeight) || 200;
                xName = attrs.xName || "X";
                yName = attrs.yName || "Y";
                isActive = attrs.tabs || false;

                $timeout(function() {
                    // width
                    width = d3.select(element[0]).node().offsetWidth;

                    // Listeners
                    // Render after page loading
                    if(isActive) {
                        render(element, scope.data);
                    };
                    
                    // Watch for resize event
                    scope.$watch(function() {
                        return angular.element(window)[0].innerWidth;
                        }, function(newVals) {
                        if(newVals)
                        {
                            render(element, scope.data);
                        }
                    });

                    // Watch for data changes and re-render
                    scope.$watch('data', function(newVals) {
                        if(newVals)
                        {
                            //definitions(scope.data);
                            render(element, scope.data);
                        }
                    },true);
                }, 1);
            }
        };
}]);
