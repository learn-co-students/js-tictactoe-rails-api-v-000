class GameSerializer < ActiveModel::Serializer
  attributes :id, :state, :created_at
end
