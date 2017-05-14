require "rails_helper"

RSpec.describe GamesController, :type => :controller do
  describe "responds to" do

    before(:each) do
      Game.destroy_all
    end

    it "creates games" do
      post :create, { :game => { :state => ["X", "", "", "", "", "", "", "", ""] } }
      expect(Game.count).to eq(1)
    end

    it "updates games" do
      Game.create(:state => ["X", "O", "", "", "", "", "", "", ""])
      patch :update, { :id => 1, :game => { :state => ["X", "", "", "", "", "", "", "", ""] } }
      expect(Game.first.state).to eq ["X", "", "", "", "", "", "", "", ""]
    end

  
  end
end
