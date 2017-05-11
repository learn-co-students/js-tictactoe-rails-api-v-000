class Game < ActiveRecord::Base
  serialize :state

  def as_json(options={})
    super(:only => [:id,:state])
  end
end
