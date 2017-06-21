class Game < ActiveRecord::Base
  serialize :state #http://api.rubyonrails.org/classes/ActiveRecord/AttributeMethods/Serialization/ClassMethods.html
  
end
