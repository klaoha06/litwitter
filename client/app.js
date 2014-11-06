(function() {
	var app = angular.module('liTwitter', ['ngRoute', 'ngResource', 'angularMoment']);

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
		$scope.now = new moment();
		// console.log(now.format("HH:mm:ss"));
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

		// Handling Hashtags
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

			// Differentiating Hashtag and Content
			var phases = $scope.text.split(' ');
			var hashtags = [];
			var regex = /([#]).+/g;
			for (var i = 0; i < phases.length; i++) {
				var check_hashtag = (regex.exec(phases[i]));
				if (check_hashtag !== null) {
					hashtags.push({name: check_hashtag[0]});
				}
			}
			// Setting Data to Server
			$http.post('http://localhost:3000/tweets', {hashtags : hashtags, tweet: {content: $scope.text}}).
			success(function(data){
				// Updating New Tweet
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
		$http.get('http://localhost:3000/tweets/search', {hashtags : hashtags, tweet: {content: $scope.text}})
	}
});

})();
