class Game < ActiveRecord::Base
  # allow arrays, hashes, and other non-mappable objects 
  # to be stored in a TEXT column	
  serialize :state, Array
end