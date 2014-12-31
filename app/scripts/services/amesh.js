'use strict';

angular.module('tokyoAmeApp')
  .factory('Amesh', function () {

    var scales = {whole: '000', tokyo: '100'};
    var stepMilliseconds = 5 * 60 * 1000; // 5 min

    function toJSTDate(date) {
      var JSTDate = new Date();
      JSTDate.setTime(date.getTime() + (date.getTimezoneOffset() * 60 * 1000) + (9 * 3600 * 1000));
      return JSTDate;
    }

    function toMeasurementDate(date) {
      var time = date.getTime();
      var timeInMin = time - time % (1000 * 60);
      var outOf5min = timeInMin % (1000 * 60 * 5);
      if (outOf5min < 1) {
        outOf5min = 1000 * 60 * 5;
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

    function getMeshImageUrl(date, size) {
      if (!size) {
        size = scales.tokyo;
      }
      var d = toJSTDate(date);

      function padding(num) {
        return num < 10 ? '0' + num : String(num);
      }

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
