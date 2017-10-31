class Game < ActiveRecord::Base
  serialize :state, Array

  def turns
    self.state.reject {|x| x == "" }.count
  end

end