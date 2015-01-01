'use strict';

angular.module('tokyoAmeApp')
  .controller('MainCtrl', function ($scope, $timeout, Amesh) {
    $scope.scale = Amesh.scales.tokyo;
    $scope.recordedDate =
    $scope.updatedDate = Amesh.getLatestMeasurementDateTime();
  });
