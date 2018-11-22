class Game < ActiveRecord::Base

# Sets up a JSON:API-compliant serialization scheme, In order to properly store
# arrays, hashes, and other non-mappable objects in a TEXT column
  
  serialize :state, Array


end