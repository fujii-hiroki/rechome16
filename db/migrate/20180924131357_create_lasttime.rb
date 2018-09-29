class CreateLasttime < ActiveRecord::Migration[5.2]
  def change
    create_table :lasttimes do |t|
      t.string    :action_name
      t.date      :lastdone_date
      t.integer   :interval
    end
  end
end
