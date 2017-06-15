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
      patch :update, { :id => 1, :state => ["X", "", "", "", "", "", "", "", ""]  }
      expect(Game.first.state).to eq ["X", "", "", "", "", "", "", "", ""]
    end

    it "should return a JSON object with the games" do
      Game.create(:state => ["X", "O", "", "", "", "", "", "", ""])
      Game.create(:state => ["X", "O", "X", "", "", "", "", "", ""])
      get :index
      expected = {
        "games"=>
          [{"id"=>1, "state"=>["X", "O", "", "", "", "", "", "", ""]}, 
          {"id"=>2, "state"=>["X", "O", "X", "", "", "", "", "", ""]}
        ]
      }
      expect(JSON.parse(response.body)).to eq expected
    end
  end
end