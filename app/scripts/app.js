'use strict';

/**
 * @ngdoc overview
 * @name tagrefineryGuiApp
 * @description
 * # tagrefineryGuiApp
 *
 * Main module of the application.
 */
angular
  .module('tagrefineryGuiApp', ['ui.router', 'btford.socket-io', 'angular-intro','ngAnimate','ui.bootstrap', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.rowEdit','ui.grid.cellNav','ui.grid.autoResize','ui.grid.grouping']);
