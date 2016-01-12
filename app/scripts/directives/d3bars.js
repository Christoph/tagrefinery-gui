'use strict';

/**
 * @ngdoc directive
 * @name tagrefineryGuiApp.directive:d3Bars
 * @description
 * # d3Bars
 */
angular.module('tagrefineryGuiApp')
    .directive('d3Bars', ["d3", function (d3) {
        var margin, barHeight, barPadding;
        var width, height, color, xScale, yScale;

        var render = function(svg, element, data) {
            // width
            width = d3.select(element[0]).node().offsetWidth - margin;
            //width = 200;

            // calculate the height
            //height = data.length * (barHeight + barPadding);
            height = 100 - (margin);

            // x-scale
            xScale = d3.scale.linear()
                .domain([0,d3.max(data, function(d) { return d.score; })]).nice()
                .range([0, width]);

            // If we don't pass any data, return out of the element
            if (!data) 
            {
                console.log("No data");
                return;
            }

            var hist = d3.layout.histogram()
                .bins(5)
                (data.map(function(d) { return d.score; }));

            // y-scale
            yScale = d3.scale.linear()
                .domain([0, d3.max(hist, function(d) { return d.y; })])
                .range([height,0]);

            // set the height based on the calculations above
            svg.attr('height', height);

            // Enter
            var bar = svg.selectAll(".bar")
                .data(hist)
                .enter()
                .append("g")
                .attr("class","bar")
                .attr("transform", function(d) { return "translate("+xScale(d.x)+","+yScale(d.y)+")"; });

            bar.append("rect");

            // Update
            var bar2 = svg.selectAll(".bar")
                .data(hist)
                .transition()
                .duration(500)
                .attr("transform", function(d) { return "translate("+xScale(d.x)+","+yScale(d.y)+")"; });

            bar2.select("rect")
                .attr("x",1)
                .attr("width", xScale(hist[0].dx) - 1)
                .attr("height", function(d) { return height - yScale(d.y); });

            // Exit
            svg.selectAll(".bar")
                .data(hist)
                .exit()
                .remove();

        };

        return {
            restrict: 'EA',
            scope: {
                data: '=',
                onClick: '&'
            },
            link: function (scope, element, attrs) {
                // Create svg
                var svg = d3.select(element[0])
                    .append('svg')
                    .style('width', '100%');

                // Create groups
                svg.append('g').attr('class', 'x-axis axis');
                svg.append('g').attr('class', 'y-axis axis');

                // Get attributes or use defaults
                margin = parseInt(attrs.margin) || 20;
                barHeight = parseInt(attrs.barHeight) || 20;
                barPadding = parseInt(attrs.barPadding) || 5;
                
                // Render after page loading
                window.onload = function() {
                    render(svg, element, scope.data);
                };
                
                // Watch for resize event
                scope.$watch(function() {
                    return angular.element(window)[0].innerWidth;
                    }, function(newVals) {
                    if(newVals)
                    {
                        render(svg, element, scope.data);
                    }
                });

                // Watch for data changes and re-render
                scope.$watch('data', function(newVals) {
                    if(newVals)
                    {
                        render(svg, element, scope.data);
                    }
                },true);
            }
        };
}]);
