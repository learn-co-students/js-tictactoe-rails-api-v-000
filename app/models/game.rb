class Game < ActiveRecord::Base
  serialize :state, Array

  # ActiveRecord will serialize object before saving it to db.
  # But when loading the object (recreating the object from the db),
  # it does the opposite! It DE-serializes the column.
  # When working with serialized data, it's easier to view it in Rails console
  # than inside sqlite
end
