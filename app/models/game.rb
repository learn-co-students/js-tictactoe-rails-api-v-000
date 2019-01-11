class Game < ActiveRecord::Base
  serialize :state, Array

#  def self.completed
#    where(completed: true)
#  end
end
