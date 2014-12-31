'use strict';

angular.module('tokyoAmeApp')
  .controller('MainCtrl', function ($scope, $timeout, Amesh) {
    $scope.scale = Amesh.scales.tokyo;
    $scope.recordedDate =
    $scope.updatedDate = Amesh.getLatestMeasurementDateTime();

    $scope.init = function() {
      console.log('MainCtrl.init');
      // hack! diasble auto focus
      $timeout(function () {
        document.activeElement.blur();
      }, 100);
    }
  });
