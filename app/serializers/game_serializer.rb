class GameSerializer < ActiveModel::Serializer
  attributes :id, :state
  # def id
  #   object.id
  # end
end
