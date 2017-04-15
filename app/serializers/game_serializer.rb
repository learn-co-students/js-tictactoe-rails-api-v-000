class GameSerializer < ActiveModel::Serializer
  attributes :id, :state, :turn
end
