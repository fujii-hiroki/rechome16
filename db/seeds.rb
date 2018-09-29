seeds = YAML.load_file("db/seeds/seed.yml")

User.delete_all
seeds[:users].each do |s|
  u = User.new
  u.id = s[:id]
  u.name = s[:name]
  u.password = s[:password]
  u.reset_password = s[:reset_password]
  u.save!
end

Lasttime.delete_all
seeds[:lasttimes].each do |s|
  lt = Lasttime.new
  lt.id = s[:id]
  lt.action_name = s[:action_name]
  lt.lastdone_date = s[:lastdone_date]
  lt.interval = s[:interval]
  lt.save!
end

