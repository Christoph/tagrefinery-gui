'use strict';

// Removes d3 is not defined warnings
/* jshint -W117 */

/**
 * @ngdoc directive
 * @name tagrefineryGuiApp.directive:d3Bars
 * @description
 * # d3Bars
 */
angular.module('tagrefineryGuiApp')
  .directive('d3Bars', function () {
    return {
      restrict: 'EA',
      scope: {
          data: '='
      },
      link: function(scope, element, attrs) {
          
          // Get attributes with defaults
          var margin = parseInt(attrs.margin) || 20,
          barHeight = parseInt(attrs.barHeight) || 20,
          barPadding = parseInt(attrs.barPadding) || 5;

            var svg = d3.select(element[0])
            .append('svg')
            .style('width', '100%');
            
            // Browser onresize event
            window.onresize = function() {
              scope.$apply();
            };

            // Render after page loading
            window.onload = function() {
                scope.render(scope.data);
            }
            
            // Here is the update problem!
          // Watch for resize event
          scope.$watch(function() {
            return angular.element(window)[0].innerWidth;
          }, function() {
            //scope.render(scope.data);
          });

          // Watch for data changes and re-render
          scope.$watchCollection('data.children', function(newVals, oldVals) {
              return scope.render(newVals);
          });
 
          scope.render = function(data) {
            // remove all previous items before render
            svg.selectAll('*').remove();
         
            // If we don't pass any data, return out of the element
            if (!data) 
            {
                console.log("No data");
                return;
            }

            // setup variables
            var width = d3.select(element[0]).node().offsetWidth - margin,
                // calculate the height
                height = scope.data.length * (barHeight + barPadding),
                // Use the category20() scale function for multicolor support
                color = d3.scale.category20(),
                // our xScale
                xScale = d3.scale.linear()
                  .domain([0, d3.max(data, function(d) {
                    return d.score;
                  })])
                  .range([0, width]);

         
            // set the height based on the calculations above
            svg.attr('height', height);
 
            //create the rectangles for the bar chart
            svg.selectAll('rect')
              .data(data).enter()
                .append('rect')
                .attr('height', barHeight)
                .attr('width', 0)
                .attr('x', Math.round(margin/2))
                .attr('y', function(d,i) {
                  return i * (barHeight + barPadding);
                })
                .attr('fill', function(d) { return color(d.score); })
                .transition()
                  .duration(1000)
                  .attr('width', function(d) {
                    return xScale(d.score);
                  });
              };
          }
      };
  });
