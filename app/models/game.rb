class Game < ActiveRecord::Base
  serialize :state, JSON #(optional enforcement of data type)
end
