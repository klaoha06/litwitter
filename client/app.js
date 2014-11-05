(function() {
	var app = angular.module('liTwitter', ['ngRoute', 'ngResource']);

	app.factory("getTweets", function($resource) {
		return $resource("http://localhost:3000/tweets/recent")
	});

	app.factory("getTweet", function($resource) {
		return EventService.get({id: 50})
	})

	app.config(function ($routeProvider) {
		$routeProvider
		.when('/', {
			controller: "LTcontroller",
			templateUrl: 'partials/main.html'
		})
		.when('/tweets/:tweetId', {
			controller: 'tweetCtl',
			templateUrl: 'partials/tweet.html'
		});
	});

	var cachedData;

	app.controller('LTcontroller', function($scope, getTweets) {
		if (cachedData) {
			$scope.tweets = cachedData
		}
		else {
			getTweets.query(function(data) {
				cachedData = data;
				$scope.tweets = cachedData;
			})
		};
	});

	app.controller('tweetCtl', function($scope, $http, $filter, $routeParams, $location) {
		var tweetId = $routeParams.tweetId;
		console.log(tweetId);
		console.log(cachedData)
		console.log($scope.tweets)
		$scope.tweet = $filter('filter')(cachedData, {id:tweetId})[0];
	})

})();
