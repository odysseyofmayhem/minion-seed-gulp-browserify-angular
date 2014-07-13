//Angular
require('../vendor/angular/angular');
//require('../vendor/angular-ui-router/release/angular-ui-router');
//require('../vendor/angular-animate/angular-animate');

// Requiring modules
var $ = jquery = require('jquery');

angular.module('app', [])

  // Run before anything else
  .run(['$rootScope', '$location', '$window', function($rootScope, $location, $window){

  }])

  // Template config
  .config(['$interpolateProvider', '$httpProvider', function($interpolateProvider, $httpProvider) {

  }]);

angular.module('app', [])
  .controller('testCtrl', ['$scope', function ($scope) {

    // Hello world!
    $scope.someData = 'testCtrl initialised... Hello world!';

  }]);
