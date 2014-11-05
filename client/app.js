(function() {
	var app = angular.module('liTwitter', ['ngRoute', 'ngResource']);

	app.factory("getTweets", function($resource) {
		return $resource("http://localhost:3000/tweets/recent");
	});

	app.factory('getHashtags', function($resource) {
		return $resource("http://localhost:3000/hashtags/popular");
	});

	app.factory("getTweet", function($resource) {
		return $resource('http://localhost:3000/tweets/', {id: '@id'});
	});

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

	var cachedTweets;
	var cachedHashtags;
	var thisTweet;

	app.controller('LTcontroller', function($scope, $http, getTweets, getHashtags) {
		// Handling Tweets
		if (cachedTweets) {
			$scope.tweets = cachedTweets;
		}
		else {
			getTweets.query(function(data) {
				cachedTweets = data;
				$scope.tweets = cachedTweets;
			});
		}

		// Handling Tweets
		if (cachedHashtags) {
			$scope.hashtags = cachedHashtags;
		}
		else {
			getHashtags.query(function(data) {
				cachedHashtags = data;
				$scope.hashtags = cachedHashtags;
			});
		}

		// New Tweet
		$scope.newTweet = function () {
			console.log($scope.text);
			$http.post('http://localhost:3000/tweets', {tweet: {content: $scope.text}}).
			success(function(data){
				$scope.tweets.unshift(data);
				$scope.text = '';
			});
		};
	});

	app.controller('tweetCtl', function($scope, $http, $filter, $routeParams, $location, getTweet) {
		var tweetId = $routeParams.tweetId;
		if (cachedTweets) {
			$scope.tweet = $filter('filter')(cachedTweets, {id:tweetId})[0];
		}
		else {
			getTweet.get({id: tweetId}, function(tweet) {
				$scope.tweet = tweet;
			});
		}
	});

})();
