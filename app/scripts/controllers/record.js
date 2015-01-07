'use strict';

angular.module('tokyoAmeApp')
  .controller('RecordCtrl', function ($scope, $interval, $filter, Amesh, Options) {

    var rangeMilliseconds = 120 * 60 * 1000; // 120 min
    var stepPrevButton = angular.element('#stepPrevButton');
    var stepNextButton = angular.element('#stepNextButton');
    var goToLatestButton = angular.element('#goToLatestButton');

    // http://api.jqueryui.com/slider/
    // https://github.com/seiyria/bootstrap-slider
    // http://seiyria.github.io/bootstrap-slider/
    var recorderSlider = angular.element('#recorderSlider').bootstrapSlider({
      max: 0,
      min: -(rangeMilliseconds),
      step: Amesh.stepMilliseconds,
      formatter: function (value) {
        var latestRecordedDate = Amesh.getLatestMeasurementDateTime();
        var now = new Date();
        var date = new Date(latestRecordedDate.getTime() + value);
        //var ago = Math.abs(value / (60 * 1000));
        var ago = Math.floor((now - date) / (60 * 1000));
        return $filter('date')(date, 'HH:mm', 'JST') + ' (' + ago + '分前' + ')';
      }
    });

    function stepPrev() {
      var latestRecordedDate = Amesh.getLatestMeasurementDateTime();
      var date = Amesh.fixedMeasurementDateTime(
        new Date($scope.$parent.recordedDate.getTime() - Amesh.stepMilliseconds / 2)
      );
      if (date.getTime() >= latestRecordedDate.getTime() - rangeMilliseconds) {
        $scope.$parent.recordedDate = date;
      }
    }

    function stepNext() {
      var latestRecordedDate = Amesh.getLatestMeasurementDateTime();
      var date = Amesh.fixedMeasurementDateTime(
        new Date($scope.$parent.recordedDate.getTime() + Amesh.stepMilliseconds * 1.5)
      );
      if (date <= latestRecordedDate) {
        $scope.$parent.recordedDate = date;
      }
    }

    function goToLatest() {
      updateRecordedDateByTimeSpan(0);
    }

    var playIntervalId;
    function play() {
      if (angular.isDefined(playIntervalId)) {
        return;
      }
      $scope.isPlaying = true;
      recorderSlider.bootstrapSlider('disable');
      if (isMaxSliderPosition()) {
        recorderSlider.bootstrapSlider('setValue', -rangeMilliseconds, true);
      }
      stepPrevButton.addClass('disabled');
      stepNextButton.addClass('disabled');
      goToLatestButton.addClass('disabled');
      playIntervalId = $interval(function () {
        stepNext();
        if (isMaxSliderPosition()) {
          stop();
        }
      }, 750);
    }

    function stop() {
      if (angular.isDefined(playIntervalId)) {
        $interval.cancel(playIntervalId);
        playIntervalId = undefined;
      }
      $scope.isPlaying = false;
      recorderSlider.bootstrapSlider('enable');
      //recorderSlider.bootstrapSlider('setValue', 0, true);
      onSliderValueChanged();
    }

    function toggleScale() {
      if ($scope.$parent.scale === Amesh.scales.tokyo) {
        $scope.$parent.scale = Amesh.scales.whole;
      } else {
        $scope.$parent.scale = Amesh.scales.tokyo;
      }
      Options.setMapScale($scope.$parent.scale);
    }

    function refreshSlider() {
      // refresh position from recordedDate
      var latestRecordedDate = Amesh.getLatestMeasurementDateTime();
      var sliderValue = latestRecordedDate.getTime() - $scope.$parent.recordedDate.getTime();
      recorderSlider.bootstrapSlider('setValue', -sliderValue, false);
      onSliderValueChanged();
    }

    function isMaxSliderPosition() {
      return 0 === recorderSlider.bootstrapSlider('getValue');
    }

    function onSliderValueChanged() {
      var value = recorderSlider.bootstrapSlider('getValue');
      //console.log('onSliderValueChanged', value);
      if (value === 0) {
        goToLatestButton.addClass('disabled');
        stepNextButton.addClass('disabled');
      } else if (!$scope.isPlaying) {
        goToLatestButton.removeClass('disabled');
        stepNextButton.removeClass('disabled');
      }
      if (value === -rangeMilliseconds) {
        stepPrevButton.addClass('disabled');
      } else if (!$scope.isPlaying) {
        stepPrevButton.removeClass('disabled');
      }
    }

    function updateRecordedDateByTimeSpan(newValue) {
      console.log('updateRecordedDateBySlider', newValue);
      var latestRecordedDate = Amesh.getLatestMeasurementDateTime();
      var value = angular.isUndefined(newValue) ? recorderSlider.bootstrapSlider('getValue') : newValue;
      onSliderValueChanged();
      $scope.$parent.recordedDate = new Date(latestRecordedDate.getTime() + value);
      //$scope.$parent.$apply();
    }

    var isSliderDragging = false;
    recorderSlider.on('slide', function (e) {
      if (!isSliderDragging) {
        updateRecordedDateByTimeSpan(e.value);
      }
    });
    recorderSlider.on('slideStart', function (/*e*/) {
      isSliderDragging = true;
    });
    recorderSlider.on('slideStop', function (e) {
      isSliderDragging = false;
      updateRecordedDateByTimeSpan(e.value);
      $scope.$parent.$apply();
    });

    $scope.$parent.$watch('recordedDate', function (/*newValue, oldValue, scope*/) {
      refreshSlider();
    });

    // update check via 1 min
    $interval(function () {
      console.log('RecordCtrl.interval to refresh map');
      // do nothing if playing
      if ($scope.isPlaying) {
        return;
      }
      var now = new Date();
      var latestRecordedDate = Amesh.fixedMeasurementDateTime(now);
      var uptoRecordedDate;
      if (isMaxSliderPosition()) {
        uptoRecordedDate = latestRecordedDate;
      } else {
        var minRecordedDate = Amesh.fixedMeasurementDateTime(new Date(now - rangeMilliseconds));
        if (latestRecordedDate.getTime() < minRecordedDate.getTime()) {
          uptoRecordedDate = minRecordedDate;
        }
      }
      $scope.$parent.updatedDate = latestRecordedDate;
      if (uptoRecordedDate) {
        $scope.$parent.recordedDate = uptoRecordedDate;
      } else {
        refreshSlider();
      }
    }, 60 * 1000);

    $scope.init = function () {
      console.log('RecordCtrl.init');
      $scope.isPlaying = false;
      $scope.wholeScale = Amesh.scales.whole;
      $scope.tokyoScale = Amesh.scales.tokyo;
      $scope.stepPrev = stepPrev;
      $scope.stepNext = stepNext;
      $scope.goToLatest = goToLatest;
      $scope.play = play;
      $scope.stop = stop;
      $scope.toggleScale = toggleScale;
      onSliderValueChanged();
    };
  });
