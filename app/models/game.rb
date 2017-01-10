class Game < ActiveRecord::Base
  serialize :state

  def self.to_json
    self.all.each do |game|
      GameSerializer.serialize(game)
    end
  end
end
