'use strict';

angular.module('tokyoAmeApp')
  .controller('MainCtrl', function ($scope, $timeout, Amesh, Options) {

    function i18n(messageName) {
      return chrome.i18n.getMessage(messageName);
    }

    $scope.scale = Options.getMapScale() || Amesh.scales.tokyo;
    $scope.recordedDate =
    $scope.updatedDate = Amesh.getLatestMeasurementDateTime();

    $scope.recordedDateFormat = i18n('recordedDateFormat');
    $scope.updatedDateFormat = i18n('updatedDateFormat');

    $scope.i18n = i18n;
    $scope.close = function() {
      window.close();
    };
  });
