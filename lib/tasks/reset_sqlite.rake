namespace :db do
  desc 'reset database id to 0'
  task reset_pk: :environment do
    puts 'reset sqlite sequence'
    ActiveRecord::Base.connection.execute("delete from sqlite_sequence where name = 'games'") 
  end
end