class Game < ActiveRecord::Base
  serialize :state, Array
  serialize :updated_at, String
end
