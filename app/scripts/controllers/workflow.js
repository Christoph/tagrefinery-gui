'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:WorkflowCtrl
 * @description
 * # WorkflowCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('WorkflowCtrl', ["$scope", "socket", "intros", "stats", function ($scope, socket, intros, stats) {
    var that = this;

    // State variables
    that.init = false;
    that.initRunning = false;
    that.preRunning = false;
    that.spellRunning = false;
    that.compRunning = false;
    that.postRunning = false;

    that.mode = "";

    that.pre = stats.getPre();
    that.spell = stats.getSpell();
    that.comp = stats.getComp();
    that.post = stats.getPost();
    that.vocabCount = stats.getVocab();
    that.datasetCount = stats.getDataset();

    $scope.showStep = false;
    $scope.currentStep = 0;

    that.progress = [];
    that.progress.push({value: 0, text: 0, type: 'warning'});
    that.progress.push({value: 0, text: 0, type: 'success'});
    that.progress.push({value: 0, text: 0, type: 'warning'});

    that.updateProgress = function()
    {
      if($scope.currentStep <= 1)
      {
        that.progress[0].value = ($scope.currentStep)*100/10;
        that.progress[0].text = ($scope.currentStep)*100;
      }

      if($scope.currentStep < 7 && $scope.currentStep >= 1)
      {
        that.progress[1].value = (($scope.currentStep-1))*100/10;
        that.progress[1].text = (($scope.currentStep-1)/5)*100;
      }

      if($scope.currentStep >= 7)
      {
        that.progress[2].value = ((($scope.currentStep-7))*100)/10;
        that.progress[2].text = (($scope.currentStep-7)/3)*100;
      }
    };

    ////////////////////////////////////////////////
    // Start
    ////////////////////////////////////////////////

    socket.on('selectedMode', function (data) {
      that.mode = data;

      that.init = true;
    });

    socket.on('initRunning', function (data) {
      that.initRunning = data == "started"
    });

    socket.on('computePre', function (data) {
      that.preRunning = data == "started"
    });

    socket.on('computeSpell', function (data) {
      that.spellRunning = data == "started"
    });

    socket.on('computeComp', function (data) {
      that.compRunning = data == "started"
    });

    socket.on('computePost', function (data) {
      that.postRunning = data == "started"
    });

    // Choose value
    that.customize = function()
    {
      $scope.showStep =! $scope.showStep;

      if($scope.currentStep == 0)
      {
        $scope.$broadcast("dPreF");
      }
      if($scope.currentStep == 1)
      {
        $scope.$broadcast("dPreB");
        socket.emit("getBlacklist", "")
      }
      if($scope.currentStep == 2)
      {
        $scope.$broadcast("dSpellT");
        socket.emit("getWhitelist", "")
      }
      if($scope.currentStep == 3)
      {
        $scope.$broadcast("dSpellR");
      }
      if($scope.currentStep == 4)
      {
        $scope.$broadcast("dCompF");
      }
      if($scope.currentStep == 5)
      {
        $scope.$broadcast("dCompU");
      }
      if($scope.currentStep == 9)
      {
        $scope.$broadcast("postSalvage");
        $scope.currentStep++;

        that.updateProgress();
      }

      if($scope.showStep)
      {
        if($scope.currentStep == 0)
        {
          intros.set("preFilter");
        }
        if($scope.currentStep == 1)
        {
          intros.set("preBlacklist");
        }
        if($scope.currentStep == 2)
        {
          intros.set("spellTruth");
        }
        if($scope.currentStep == 3)
        {
          intros.set("spellCorrect");
        }
        if($scope.currentStep == 4)
        {
          intros.set("compF");
        }
        if($scope.currentStep == 5)
        {
          intros.set("compU");
        }
        if($scope.currentStep == 7)
        {
          intros.set("postF");
        }
        if($scope.currentStep == 8)
        {
          intros.set("postR");
        }
        if($scope.currentStep == 9)
        {
          intros.set("postS");
        }
      }
      else
      {
        intros.set("guided");
      }
    };

    that.ok = function()
    {
      $scope.showStep = false;
      $scope.currentStep++;
      intros.set("guided");

      that.updateProgress();

      if($scope.currentStep == 6 || $scope.currentStep == 10)
      {
        $scope.showStep = true;
        intros.set("result");
      }

      that.apply();
      if($scope.currentStep == 6) socket.emit("computeWorkflow", "");
    };

    that.back = function()
    {
      $scope.showStep = false;
      $scope.currentStep--;
      intros.set("guided");

      that.updateProgress();

      if($scope.currentStep == 6)
      {
        $scope.showStep = true;
      }
    };

    that.restartFinalize = function()
    {
      $scope.showStep = false;
      $scope.currentStep = 7;

      that.updateProgress();
    };

    that.restart = function()
    {
      $scope.showStep = false;
      $scope.currentStep = 1;

      that.updateProgress();
    };

    that.goToAdvanced = function()
    {
      intros.set("advanced");
      socket.emit("selectMode", "free");
    };

    that.goToLinked = function()
    {
      intros.set("linked");
      socket.emit("selectMode", "linked");
    };

    that.apply = function()
    {
      // Let the child apply changes
      $scope.$broadcast("apply");
      socket.emit("computeWorkflow", "");
    };

    that.runAll = function()
    {
      // Reset prefilter
      socket.emit("applyPrefilter", "" + 0);
      stats.writePre("Occurrence threshold", 0);
      stats.writePre("Number of Filtered Words", 0);

      // Run whole workflow
      socket.emit("computeWorkflow", "");
    };

    that.getPercent = function(max)
    {
      return ($scope.currentStep / max) * 100;
    };

    that.default = function()
    {
      if($scope.currentStep == 0)
      {
        $scope.$broadcast("dPreF");
      }
      if($scope.currentStep == 1)
      {
        $scope.$broadcast("dPreB");
        that.apply();
      }
      if($scope.currentStep == 2)
      {
        $scope.$broadcast("dSpellT");
        that.apply();
      }
      if($scope.currentStep == 3)
      {
        $scope.$broadcast("dSpellR");
      }
      if($scope.currentStep == 4)
      {
        $scope.$broadcast("dCompF");
      }
      if($scope.currentStep == 5)
      {
        $scope.$broadcast("dCompU");
        that.apply();
      }

      $scope.showStep = false;
      $scope.currentStep++;
      intros.set("guided");

      that.updateProgress();

      if($scope.currentStep == 6)
      {
        $scope.showStep = true;
      }
      if($scope.currentStep == 10)
      {
        $scope.showStep = true;
      }

    };
    that.no = function()
    {
      if($scope.currentStep == 0)
      {
        $scope.$broadcast("noPreF");
      }
      if($scope.currentStep == 1)
      {
        $scope.$broadcast("noPreB");
        that.apply();
      }
      if($scope.currentStep == 2)
      {
        $scope.$broadcast("noSpellT");
        that.apply();
      }
      if($scope.currentStep == 3)
      {
        $scope.$broadcast("noSpellR");
      }
      if($scope.currentStep == 4)
      {
        $scope.$broadcast("noCompF");
      }
      if($scope.currentStep == 5)
      {
        $scope.$broadcast("noCompU");
        that.apply();
      }
      if($scope.currentStep == 7)
      {
        $scope.$broadcast("noPostI");
      }

      $scope.showStep = false;
      $scope.currentStep++;
      intros.set("guided");

      that.updateProgress();

      if($scope.currentStep == 6)
      {
        $scope.showStep = true;
      }
      if($scope.currentStep == 10)
      {
        $scope.showStep = true;
      }

    };

  }]);
