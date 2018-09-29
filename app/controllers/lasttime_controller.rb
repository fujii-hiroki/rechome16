class LasttimeController < ApplicationController

  def index
    @list = get_ordered_list
  end

  def create
    l = Lasttime.new
    l.action_name = params[:name]
    l.interval = params[:interval]
    l.lastdone_date = Date.today
    l.save!

    @list = get_ordered_list
    render partial: "/lasttime/record_table"
  end

  def delete
    Lasttime.find_by(:id => params[:id]).try(:delete)
    @list = get_ordered_list
    render partial: "/lasttime/record_table"
  end

  def done
    l = Lasttime.find_by(:id => params[:id])
    l.lastdone_date = params[:inputDate]
    l.save
    @list = get_ordered_list
    render partial: "/lasttime/record_table"
  end

  private

  # 緊急度の高い順でソートされたリストを取得する
  def get_ordered_list

    # 全データを取得しhash化
    hash_list = Lasttime.all.map do |data|
      data.attributes.symbolize_keys
    end

    # 最終実施日＋インターバル日を「ゴール日」として設定する
    # その際、本日との差分日もあわせて設定する（0を超えたら超過）
    today = Date.today
    hash_list.map do |hash|
      # ゴール日を設定
      goal_date = hash[:lastdone_date] + hash[:interval].day
      hash[:goal_date] = goal_date
      # 本日ーゴール日を算出し、差分日として設定
      diff = (today - goal_date).to_i
      hash[:diff] = diff
      # 差分日から「期限内」「当日」「超過」をフラグとして保持
      # （どれか一つが true となる）
      hash[:is_within] = ( diff < 0  )
      hash[:is_today]  = ( diff == 0 )
      hash[:is_over]   = ( 0 < diff  )
    end

    # 差分日の降順（超過しているものが先頭）でソートする
    hash_list.sort { |a, b| b[:diff] <=> a[:diff] }
  end

end
