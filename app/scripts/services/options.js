'use strict';

angular.module('tokyoAmeApp')
  .factory('Options', function ($rootScope) {

    var mapScale = null;
    var mapPosition = null;

    function save() {
      if (chrome && chrome.storage) {
        chrome.storage.local.set({mapScale: mapScale, mapPosition: mapPosition}, function (/*items*/){
          $rootScope.$broadcast('options.saved');
        });
      } else if (window.localStorage) {
        localStorage.setItem('mapScale', mapScale);
        localStorage.setItem('mapPosition', angular.toJson(mapScale));
      }
    }

    function load() {
      if (chrome && chrome.storage) {
        chrome.storage.local.get(['mapScale', 'mapPosition'], function (items){
          console.log('Options.load', items);
          mapScale = items.mapScale;
          mapPosition = items.mapPosition;
          $rootScope.$broadcast('options.loaded');
        });
      } else if (window.localStorage) {
        mapScale = localStorage.getItem('mapScale');
        mapPosition = angular.fromJson(localStorage.setItem('mapPosition'));
      }
    }

    function setMapScale(scale) {
      if (mapScale !== scale) {
        mapScale = scale;
        save();
      }
    }

    function getMapScale() {
      return mapScale;
    }

    function setMapPosition(position) {
      mapPosition = position;
      save();
    }

    function getMapPosition() {
      return mapPosition;
    }

    return {
      save: save,
      load: load,
      setMapScale: setMapScale,
      getMapScale: getMapScale,
      setMapPosition: setMapPosition,
      getMapPosition: getMapPosition
    };

  });
