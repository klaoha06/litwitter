var app = angular.module('liTwitter', ['ngRoute'])
app.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    controller: "LTcontroller",
    templateUrl: 'partials/main.html'
  });
});

app.controller('LTcontroller', function($scope) {
  
});

