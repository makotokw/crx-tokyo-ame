'use strict';

angular.module('tokyoAmeApp')
  .controller('MainCtrl', function ($scope, Amesh) {
    $scope.scale = Amesh.scales.tokyo;
    $scope.recordedDate =
    $scope.updatedDate = Amesh.getLatestMeasurementDateTime();
  });
