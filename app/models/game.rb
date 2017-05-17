class Game < ActiveRecord::Base
  serialize :state
  validates :state, presence: true
  after_initialize :board

  def board
    self.state ||= ["", "", "", "", "", "", "", "", ""]
  end

end
