class Game < ActiveRecord::Base
  serialize :state

  def as_json(options={}) 
    {
      id: id, 
      state: state 
    }
  end 
end
