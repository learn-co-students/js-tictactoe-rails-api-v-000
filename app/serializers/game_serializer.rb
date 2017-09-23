class GameSerializer < ActiveModel::Serializer
  attributes :id, :state, :turnCount
end
