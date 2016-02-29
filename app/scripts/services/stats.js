'use strict';

/**
 * @ngdoc service
 * @name tagrefineryGuiApp.stats
 * @description
 * # stats
 * Service in the tagrefineryGuiApp.
 */
angular.module('tagrefineryGuiApp')
  .service('stats', ["$rootScope", function ($rootScope) {

    var stats = {};

    stats.pre = {};
    stats.spell = {};
    stats.comp = {};
    stats.post = {};

    stats.writePre = function (key, value) {
      stats.pre[key] = value;
    }

    stats.writeSpell = function (key, value) {
      stats.spell[key] = value;
    }

    stats.writeComp = function (key, value) {
      stats.comp[key] = value;
    }

    stats.writePost = function (key, value) {
      stats.post[key] = value;
    }

    stats.getPre = function () {
      return stats.pre;
    }

    stats.getSpell = function () {
      return stats.spell;
    }

    stats.getComp = function () {
      return stats.comp;
    }

    stats.getPost = function () {
      return stats.post;
    }

    return stats;

  }]);
