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

    that.list.guided = {
      overlayOpacity: 0.3,
      steps:[
         {
          element: '#guided1',
          intro: "Use the default values described ...",
          position: 'top'
        },{
          element: '#guided2',
          intro: "... in the lower area. Mouse over the area to highlight it.",
          position: 'top'
        },{
          element: '#guided3',
          intro: "Click here to customize the step.",
          position: 'top'
        },{
          element: '#guided4',
          intro: "Each <strong>bold</strong> word provides additional informations by mouseover.",
          position: 'top'
        },
        {
          element: '#guided5',
          intro: "Switch between the different modes.    ",
          position: 'right'
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


    that.list.preFilter= {
      overlayOpacity: 0.3,
      steps:[
        {
          element: '#preF1',
          intro: "The plot shows how many words occur how often. Find the minimum occurrence a word should have. <br> You can <strong>zoom and pan</strong> into sensitive areas and " +
          "select a value by dragging the horizontal bar or clicking into the plot.",
          position: 'top'
        },
        {
          element: '#preF2',
          intro: "You can see/update the threshold and the number of words in the dataset using the current threshold.",
          position: 'top'
        },
        {
          element: '#preF3',
          intro: "Inspect Words opens a grid view where you can see all words and there occurrence.",
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

    that.list.preBlacklist= {
      overlayOpacity: 0.3,
      steps:[
        {
          element: '#preB1',
          intro: "The currently used list of words which will be removed from the dataset.",
          position: 'top'
        },
        {
          element: '#preB2',
          intro: "Add words from a new file to the list.",
          position: 'top'
        },
        {
          element: '#preB3',
          intro: "Clear the list.",
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

    return {
      state: state,
      set: function(page)
      {
        state.current = that.list[page];
      }
    }
  });
