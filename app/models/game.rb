class Game < ActiveRecord::Base
  #Every game will have a unique id and a state
  serialize :state, Array
end
