class Game < ActiveRecord::Base
  serialize :state, JSON

end
