'use strict';

angular.module('tokyoAmeApp')
  .controller('MainCtrl', function ($scope, $timeout, Amesh, Options) {
    $scope.scale = Options.getMapScale() || Amesh.scales.tokyo;
    $scope.recordedDate =
    $scope.updatedDate = Amesh.getLatestMeasurementDateTime();

    $scope.close = function() {
      window.close();
    }
  });
