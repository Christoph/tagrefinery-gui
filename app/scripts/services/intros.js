'use strict';

/**
 * @ngdoc factory
 * @name tagrefineryGuiApp.intros
 * @description
 * # intros
 * Service in the tagrefineryGuiApp.
 */
angular.module('tagrefineryGuiApp')
  .factory('intros', function () {
    var that = this;

    that.list = {};
    var state = {};

    that.list.running = {
      overlayOpacity: 0.3,
      steps:[
        {
          element: '#update1',
          intro: "Reconnect to the current Season.",
          position: 'top'
        },
        {
          element: '#update2',
          intro: "Update your data here.",
          position: 'top'
        }
      ],
      showStepNumbers: false,
      showBullets: true,
      exitOnOverlayClick: true,
      exitOnEsc: true,
      nextLabel: '<strong>Next</strong>',
      prevLabel: 'Previous',
      skipLabel: 'Exit',
      doneLabel: 'Done'
    };

    that.list.import = {
      overlayOpacity: 0.3,
      steps:[
        {
          element: '#import1',
          intro: "Upload a csv file or add another file.",
          position: 'top'
        },
        {
          element: '#import2',
          intro: "Review the uploaded data.",
          position: 'top'
        },
        {
          element: '#import3',
          intro: '<span class="fa fa-trash"></span> Clear or <span class="fa fa-floppy-o"></span> Save the uploaded data.',
          position: 'top'
        }
      ],
      showStepNumbers: false,
      showBullets: true,
      exitOnOverlayClick: true,
      exitOnEsc: true,
      nextLabel: '<strong>Next</strong>',
      prevLabel: 'Previous',
      skipLabel: 'Exit',
      doneLabel: 'Done'
    };

    that.intro = {
      overlayOpacity: 0.3,
      steps:[
        {
          element: '#pre1',
          intro: "Import your csv file.",
          position: 'top'
        },
        {
          element: '#pre2',
          intro: "In each screen just click onto the small <i class='fa fa-film'></i> to show the introduction.",
          position: 'left'
        }
      ],
      showStepNumbers: false,
      showBullets: true,
      exitOnOverlayClick: true,
      exitOnEsc: true,
      nextLabel: '<strong>Next</strong>',
      prevLabel: 'Previous',
      skipLabel: 'Exit',
      doneLabel: 'Done'
    };


    that.preFilterIntro = {
      overlayOpacity: 0.3,
      steps:[
        {
          element: '#pre1',
          intro: "Import your csv file.",
          position: 'top'
        },
        {
          element: '#pre2',
          intro: "In each screen just click onto the small <i class='fa fa-film'></i> to show the introduction.",
          position: 'left'
        }
      ],
      showStepNumbers: false,
      showBullets: true,
      exitOnOverlayClick: true,
      exitOnEsc: true,
      nextLabel: '<strong>Next</strong>',
      prevLabel: 'Previous',
      skipLabel: 'Exit',
      doneLabel: 'Done'
    };

    return {
      state: state,
      set: function(page)
      {
        state.current = that.list[page];
      }
    }
  });
