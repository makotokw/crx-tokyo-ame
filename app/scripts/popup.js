'use strict';

angular
  .module('tokyoAmeApp', [])
  .config([
    '$compileProvider',
    function ($compileProvider) {
      var validProtocols = /^\s*(https?|chrome-extension):/;
      $compileProvider.aHrefSanitizationWhitelist(validProtocols);
      $compileProvider.imgSrcSanitizationWhitelist(validProtocols);
    }
  ]);