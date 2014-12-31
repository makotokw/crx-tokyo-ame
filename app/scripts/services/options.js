'use strict';

angular.module('tokyoAmeApp')
  .factory('Options', function () {

    function setItemWithJson(key, data) {
      localStorage.setItem(key, angular.toJson(data));
    }
    function getItemWithJson(key) {
      var data = localStorage.getItem(key);
      return angular.fromJson(data);
    }

    function setMapPosition(position) {
      setItemWithJson('mapPosition', position);
    }

    function getMapPosition() {
      return getItemWithJson('mapPosition');
    }

    return {
      setItemWithJson: setItemWithJson,
      getItemWithJson: getItemWithJson,
      setMapPosition: setMapPosition,
      getMapPosition: getMapPosition
    };

  });
