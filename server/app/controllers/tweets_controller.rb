class TweetsController < ApplicationController
  def recent
    tweets = Tweet.ordered_json
    render json: tweets
  end

  def search
    hashtag = Hashtag.where(name: params[:keyword]).first
    if hashtag
      render json: hashtag.tweets.ordered_json
    else
      render :nothing => true, status: 404
    end
  end

  def get
    tweets
  end

  def create
    params.permit!
    tweet = Tweet.new(params[:tweet])
    tweet.content ||= Faker::Lorem.sentence
    tweet.username ||= Faker::Name.name
    tweet.handle ||= "@" + Faker::Internet.user_name
    tweet.avatar_url ||= Faker::Avatar.image(tweet.username)
    tweet.save

    hashtags_names = params[:hashtags] || []
    hashtags_names.each do |name|
      p name[:name]
      new_hashtag = Hashtag.find_by(name: name[:name])
      if new_hashtag
        tweet.hashtags << new_hashtag
      else
        tweet.hashtags << Hashtag.create(name: name[:name])
      end
    end

    render json: tweet.to_json(methods: :hashtag_names)
  end

end
