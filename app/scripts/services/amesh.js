'use strict';

angular.module('tokyoAmeApp')
  .factory('Amesh', function () {

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

    function getMeshImageUrl(date, size) {
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

    return {
      scales: scales,
      stepMilliseconds: stepMilliseconds,
      getMeshImageUrl: getMeshImageUrl,
      fixedMeasurementDateTime: fixedMeasurementDateTime,
      getLatestMeasurementDateTime: getLatestMeasurementDateTime
    };
  });
