'use strict';

angular.module('tokyoAmeApp')
  .controller('RecordCtrl', function ($scope, $interval, $filter, Amesh) {

    var rangeMilliseconds = 120 * 60 * 1000; // 120 min
    var isDirty = false; // not latest recorded
    var stepPrevButton = angular.element('#stepPrevButton');
    var stepNextButton = angular.element('#stepNextButton');

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
        isDirty = true;
      }
    }

    function stepNext() {
      var latestRecordedDate = Amesh.getLatestMeasurementDateTime();
      var date = Amesh.fixedMeasurementDateTime(
        new Date($scope.$parent.recordedDate.getTime() + Amesh.stepMilliseconds * 1.5)
      );
      if (date <= latestRecordedDate) {
        $scope.$parent.recordedDate = date;
        if (latestRecordedDate.getTime() === $scope.$parent.recordedDate.getTime()) {
          isDirty = false;
        }
      }
    }

    var playIntervalId;
    function play() {
      if (angular.isDefined(playIntervalId)) {
        return;
      }
      $scope.isPlaying = true;
      recorderSlider.bootstrapSlider('disable');
      recorderSlider.bootstrapSlider('setValue', -rangeMilliseconds, true);
      stepPrevButton.addClass('disabled');
      stepNextButton.addClass('disabled');
      playIntervalId = $interval(function () {
        stepNext();
        if (!isDirty) {
          stop();
        }
      }, 1000);
    }

    function stop() {
      if (angular.isDefined(playIntervalId)) {
        $interval.cancel(playIntervalId);
        playIntervalId = undefined;
      }
      $scope.isPlaying = false;
      recorderSlider.bootstrapSlider('enable');
      recorderSlider.bootstrapSlider('setValue', 0, true);
      stepPrevButton.removeClass('disabled');
      stepNextButton.removeClass('disabled');
    }

    function toggleScale() {
      if ($scope.$parent.scale === Amesh.scales.tokyo) {
        $scope.$parent.scale = Amesh.scales.whole;
      } else {
        $scope.$parent.scale = Amesh.scales.tokyo;
      }
    }

    function refreshSlider() {
      // refresh position from recordedDate
      var latestRecordedDate = Amesh.getLatestMeasurementDateTime();
      var sliderValue = latestRecordedDate.getTime() - $scope.$parent.recordedDate.getTime();
      recorderSlider.bootstrapSlider('setValue', -sliderValue, false);
    }

    function updateRecordedDateByTimeSpan(newValue) {
      console.log('updateRecordedDateBySlider', newValue);
      var latestRecordedDate = Amesh.getLatestMeasurementDateTime();
      var value = angular.isUndefined(newValue) ? recorderSlider.getValue() : newValue;
      isDirty = value !== 0;
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
      var now = new Date();
      var latestRecordedDate = Amesh.fixedMeasurementDateTime(now);
      if (!isDirty) {
        $scope.$parent.recordedDate = latestRecordedDate;
      } else {
        var minRecordedDate = Amesh.fixedMeasurementDateTime(new Date(now - rangeMilliseconds));
        if (latestRecordedDate.getTime() < minRecordedDate.getTime()) {
          $scope.$parent.recordedDate = minRecordedDate;
        }
      }
      $scope.$parent.updatedDate = latestRecordedDate;
    }, 60 * 1000);

    $scope.init = function () {
      console.log('RecordCtrl.init');
      $scope.isPlaying = false;
      $scope.wholeScale = Amesh.scales.whole;
      $scope.tokyoScale = Amesh.scales.tokyo;
      $scope.stepPrev = stepPrev;
      $scope.stepNext = stepNext;
      $scope.play = play;
      $scope.stop = stop;
      $scope.toggleScale = toggleScale;
    };
  });
