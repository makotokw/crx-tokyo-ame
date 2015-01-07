'use strict';

angular.module('tokyoAmeApp')
  .factory('Amesh', function ($q, $http, $interval) {

    var scales = {whole: '000', tokyo: '100'};
    var oneMinutesMilliseconds = 60 * 1000;
    var stepMilliseconds = 5 * oneMinutesMilliseconds; // 5 min

    function toJSTDate(date) {
      var JSTDate = new Date();
      JSTDate.setTime(date.getTime() + (date.getTimezoneOffset() * oneMinutesMilliseconds) + (9 * 3600 * 1000));
      return JSTDate;
    }

    function toMeasurementDate(date) {
      var now = date.getTime();
      // round seconds
      var timeInMin = now - now % oneMinutesMilliseconds;
      // remain to round 5min
      var outOf5min = timeInMin % stepMilliseconds;
      // margin 1 min to update rain map
      if (outOf5min <= oneMinutesMilliseconds) {
        outOf5min += stepMilliseconds;
      }
      return new Date(timeInMin - outOf5min);
    }

    function fixedMeasurementDateTime(date) {
      date = toJSTDate(date);
      date = toMeasurementDate(date);
      return date;
    }

    function getLatestMeasurementDateTime() {
      return fixedMeasurementDateTime(new Date());
    }

    function padding(num) {
      return num < 10 ? '0' + num : String(num);
    }

    function buildMeshImageUrl(date, size) {
      if (!size) {
        size = scales.tokyo;
      }
      var d = toJSTDate(date);
      return 'http://tokyo-ame.jwa.or.jp/mesh/' + size + '/' +
        d.getFullYear() +
        padding(d.getMonth() + 1) +
        padding(d.getDate()) +
        padding(d.getHours()) +
        padding(d.getMinutes()) +
        '.gif';
    }

    var cacheExpiredTime = 3 * 3600 * 1000; // 3 hours
    var cacheMeshImageUrls = {};

    /**
     *
     * @param {String} meshImageUrl
     * @returns {Date}
     */
    function parseDateTime(meshImageUrl) {
      var m = meshImageUrl.match(/([\d]{4})([\d]{2})([\d]{2})([\d]{2})([\d]{2})\.gif$/);
      return new Date(m[1], m[2] - 1, m[3], m[4], m[5]);
    }

    function deleteExpiredCache() {
      var base = getLatestMeasurementDateTime();
      var expiredKeys = [];
      angular.forEach(cacheMeshImageUrls, function (blobUrl, url) {
        var d = parseDateTime(url);
        if (base - d > cacheExpiredTime) {
          expiredKeys.push(url);
        }
      });
      angular.forEach(expiredKeys, function (key) {
        delete cacheMeshImageUrls[key];
      });
      console.log('deleteExpiredCache', expiredKeys);
    }

    function getMeshImageUrl(date, size) {
      return $q(function (resolve, reject) {
        var url = buildMeshImageUrl(date, size);
        if (cacheMeshImageUrls[url]) {
          return resolve(cacheMeshImageUrls[url]);
        }
        $http.get(url, {responseType:'blob'})
          .success(function (response) {
            var blobUrl = URL.createObjectURL(response);
            cacheMeshImageUrls[url] = blobUrl;
            return resolve(blobUrl);
          })
          .error(function() {
            reject();
          });
      });
    }

    $interval(function () {
      deleteExpiredCache();
    }, 10 * 60 * 1000);

    return {
      scales: scales,
      stepMilliseconds: stepMilliseconds,
      getMeshImageUrl: getMeshImageUrl,
      fixedMeasurementDateTime: fixedMeasurementDateTime,
      getLatestMeasurementDateTime: getLatestMeasurementDateTime
    };
  });
