class Game < ActiveRecord::Base
  serialize :state

  @@count = 0

  def self.count
  	@@count
  end

  def self.count=(value)
    @@count = value
  end

end
