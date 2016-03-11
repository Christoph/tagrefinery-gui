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
          intro: "... in the lower area. Mouse over the area to highlight it. <strong>Bolt</strong> words provide additional information on mouse over.",
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

    that.list.spellTruth= {
      overlayOpacity: 0.3,
      steps:[
        {
          element: '#spellT1',
          intro: "The currently used list of words which are treated as correct words and used as seeds for the spell correction.",
          position: 'top'
        },
        {
          element: '#spellT2',
          intro: "Add words from a new file to the list.",
          position: 'top'
        },
        {
          element: '#spellT3',
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

    that.list.spellCorrect= {
      overlayOpacity: 0.3,
      steps:[
        {
          element: '#spellC1',
          intro: "The plot shows how many words have a certain word quality. Find the minimum occurrence a word should have. <br> You can <strong>zoom and pan</strong> into sensitive areas and " +
          "select a value by dragging the horizontal bar or clicking into the plot.",
          position: 'top'
        },
        {
          element: '#spellC2',
          intro: "The current threshold and the number of words which will be treated as correct.",
          position: 'top'
        },
        {
          element: '#spellC3',
          intro: "Shows a list with all words and the corresponding word qualities.",
          position: 'top'
        },
        {
          element: '#spellC4',
          intro: "You can choose a similarity by moving the black dot around.",
          position: 'top'
        },
        {
          element: '#spellC5',
          intro: "The current similarity and the number of total replacements.",
          position: 'top'
        },
        {
          element: '#spellC6',
          intro: "Shows a list of all replacements.",
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

    that.list.compF= {
      overlayOpacity: 0.3,
      steps:[
        {
          element: '#compF1',
          intro: "The plot shows how many multiword tags have a certain group strength. <br> You can <strong>zoom and pan</strong> into sensitive areas and " +
          "select a value by dragging the horizontal bar or clicking into the plot.",
          position: 'top'
        },
        {
          element: '#compF2',
          intro: "The current threshold and the number of accepted groups.",
          position: 'top'
        },
        {
          element: '#compF3',
          intro: "Shows a list of all groups.",
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

    that.list.compU= {
      overlayOpacity: 0.3,
      steps:[
        {
          element: '#compU1',
          intro: "The plot shows how many multiword tags have a certain group strength. <br> You can <strong>zoom and pan</strong> into sensitive areas and " +
          "select a value by dragging the horizontal bar or clicking into the plot.",
          position: 'top'
        },
        {
          element: '#compU2',
          intro: "The current threshold and the number of accepted groups.",
          position: 'top'
        },
        {
          element: '#compU3',
          intro: "Shows a list of all groups.",
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

    that.list.result= {
      overlayOpacity: 0.3,
      steps:[
        {
          element: '#result1',
          intro: "The list shows the final dataset. By selecting an element ...",
          position: 'top'
        },
        {
          element: '#result2',
          intro: "... the history of the selected row will be shown.",
          position: 'top'
        },
        {
          element: '#result3',
          intro: "This is a summary all parameters.",
          position: 'top'
        },
        {
          element: '#result4',
          intro: "Refine shows the linked view and allows further parameter refinement.",
          position: 'top'
        },
        {
          element: '#result5',
          intro: "The advanced mode gives more freedom and less guidance.",
          position: 'top'
        },
        {
          element: '#result6',
          intro: "Finalize the dataset.",
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
