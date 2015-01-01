'use strict';

angular.module('tokyoAmeApp')
  .controller('MapCtrl', function ($scope, Amesh, Options) {

    var defaultMapPosition = {left: -1492, top: -727}; // shibuya
    var viewSize = {width: 770, height: 480};
    var mapSize = {width: 3080, height: 1920};
    var mapElement = angular.element('#mapArea');

    function setPosition(position) {
      mapElement.css({'top': position.top, 'left': position.left});
    }

    function restorePosition() {
      var position = Options.getMapPosition() || defaultMapPosition;
      setPosition(position);
    }

    function refreshMesh() {
      $scope.meshImageUrl = Amesh.getMeshImageUrl($scope.$parent.recordedDate, $scope.$parent.scale);
    }

    var defaultDraggableOption = {
      containment: [viewSize.width - mapSize.width, viewSize.height - mapSize.height, 0, 0],
      scroll: false,
      disabled: false,
      stop: function( event, ui ) {
        console.log(ui.position.left, ui.position.top);
        Options.setMapPosition({left: ui.position.left, top: ui.position.top});
      }
    };

    function refreshMap() {
      var elementSize = mapSize;
      var refreshPosition = restorePosition;
      var draggableOption = defaultDraggableOption;
      var mapCursor = 'move';

      if ($scope.$parent.scale === Amesh.scales.whole) {
        elementSize = viewSize;
        mapCursor = 'default';
        refreshPosition = function() {
          setPosition({left: 0, top: 0});
        };
        draggableOption = {
          disabled: true
        };
      }

      mapElement
        .css({width: elementSize.width, height: elementSize.height, cursor: mapCursor})
        .draggable(draggableOption)
        .find('img').css({width: elementSize.width, height: elementSize.height});

      refreshPosition();
      refreshMesh();
    }

    $scope.$parent.$watch('scale', function (/*newValue, oldValue, scope*/) {
      refreshMap();
    });

    $scope.$parent.$watch('recordedDate', function (/*newValue, oldValue, scope*/) {
      refreshMesh();
    });

    $scope.init = function () {
      console.log('MapCtrl.init');
      refreshMap();
      mapElement.css('visibility', 'visible');
    };

  });
