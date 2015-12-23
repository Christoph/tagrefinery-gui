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
        var width, height, color, xScale;

        var render = function(svg, element, data) {
            // width
            width = d3.select(element[0]).node().offsetWidth - margin;

            // x-scale
            xScale = d3.scale.linear()
                .domain([0, d3.max(data, function(d) {
                    return d.score;
                })])
                .range([0, width]);

            // If we don't pass any data, return out of the element
            if (!data) 
            {
                console.log("No data");
                return;
            }

            // set the height based on the calculations above
            svg.attr('height', height);

            // Add new data points
            svg.select('.data')
                .selectAll('rect').data(data)
                .enter()
                .append('rect')
                .attr('fill', function(d) { return color(d.score); })
                .attr('x', Math.round(margin/2))
                .attr('y', function(d,i) {
                    return i * (barHeight + barPadding);
                })
                .attr('width', 0)
                .attr('height', barHeight);

            svg.select('.data')
                .selectAll('rect').data(data)
                .transition()
                .duration(1000)
                .attr('width', function(d) {
                    return xScale(d.score);
                });
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
                svg.append('g').attr('class', 'data');
                svg.append('g').attr('class', 'x-axis axis');
                svg.append('g').attr('class', 'y-axis axis');

                // Get attributes or use defaults
                margin = parseInt(attrs.margin) || 20;
                barHeight = parseInt(attrs.barHeight) || 20;
                barPadding = parseInt(attrs.barPadding) || 5;
                
                // calculate the height
                width = 300;
                //height = scope.data.length * (barHeight + barPadding);
                height = 200;
                // Use the category20() scale function for multicolor support
                color = d3.scale.category20();

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
                        // Generates a lot of warnings
                        //render(svg, element, scope.data);
                    }
                });

                // Watch for data changes and re-render
                scope.$watchCollection('data.children', function(newVals) {
                    if(newVals)
                    {
                        render(svg, element, scope.data);
                    }
                });
            }
        };
}]);
