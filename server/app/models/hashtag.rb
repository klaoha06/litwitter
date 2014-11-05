class Hashtag < ActiveRecord::Base
  validates :name, uniqueness: true
  has_many :tweet_tags
  has_many :tweets, through: :tweet_tags

  def to_param
    name.to_s
  end
end
