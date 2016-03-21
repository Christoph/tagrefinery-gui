'use strict';

/**
 * @ngdoc service
 * @name tagrefineryGuiApp.stats
 * @description
 * # stats
 * Service in the tagrefineryGuiApp.
 */
angular.module('tagrefineryGuiApp')
  .service('stats', ["socket", function (socket) {

    socket.on('rawVocabSize', function (data) { stats.writeVocab("Original", data); });
    socket.on('preVocabSize', function (data) { stats.writeVocab("After Preprocessing", data); });
    socket.on('spellVocabSize', function (data) { stats.writeVocab("After Spell Correction", data); });
    socket.on('compVocabSize', function (data) { stats.writeVocab("After Multiword Tag Detection", data); });
    socket.on('postVocabSize', function (data) { stats.writeVocab("Final", data); });

    socket.on('rawDataset', function (data) { stats.writeDataset("Original", data); });
    socket.on('preDataset', function (data) { stats.writeDataset("After Preprocessing", data); });
    socket.on('spellDataset', function (data) { stats.writeDataset("After Spell Correction", data); });
    socket.on('compDataset', function (data) { stats.writeDataset("After Multiword Tag Detection", data); });
    socket.on('postDataset', function (data) { stats.writeDataset("Final", data); });

    var stats = {};

    stats.vocab = {};
    stats.dataset = {};
    stats.pre = {};
    stats.spell = {};
    stats.comp = {};
    stats.post = {};

    stats.writePre = function (key, value) {
      stats.pre[key] = value;
    };

    stats.writeSpell = function (key, value) {
      stats.spell[key] = value;
    };

    stats.writeComp = function (key, value) {
      stats.comp[key] = value;
    };

    stats.writePost = function (key, value) {
      stats.post[key] = value;
    };

    stats.writeVocab = function (key, value) {
      stats.vocab[key] = value;
    };

    stats.writeDataset = function (key, value) {
      stats.dataset[key] = value;
    };

    stats.getPre = function () {
      return stats.pre;
    };

    stats.getSpell = function () {
      return stats.spell;
    };

    stats.getComp = function () {
      return stats.comp;
    };

    stats.getPost = function () {
      return stats.post;
    };

    stats.getVocab = function () {
      return stats.vocab;
    };

    stats.getDataset = function () {
      return stats.dataset;
    };

    return stats;

  }]);
