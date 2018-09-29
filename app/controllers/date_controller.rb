class DateController < ApplicationController

  # 「いついつまで後○○日」用定義
  TO_DATES = [
    { date: "6/11",       note: "ママ誕生日" },
    { date: "10/5",       note: "パパ誕生日" },
    { date: "11/26",      note: "こよ誕生日" },
    { date: "5/3",        note: "みひろ誕生日" },
    { date: "12/31",      note: "大晦日" },
    { date: "4/29",       note: "結婚記念日" },
    { date: "2021/4/29",  note: "結婚して10年" },
    { date: "2032/11/26", note: "こよ二十歳" },
    { date: "2038/5/3",   note: "みひろ二十歳" },
    { date: "10/16",      note: "パパママ記念日" },
    { date: "26",         note: "こよ月齢" },
    { date: "3",          note: "みひろ月齢" }
  ]

  # 「これだけ経ちました」用定義
  FROM_DATES = [
    { date: "2012/11/26", note: "こよ誕生" },
    { date: "2018/5/3",   note: "みひろ誕生" },
    { date: "2011/4/29",  note: "パパ・ママ結婚" },
    { date: "2010/10/16", note: "付き合って" },
    { date: "2010/8/28",  note: "出会って" },
    { date: "1984/6/11",  note: "ママ誕生" },
    { date: "1981/10/5",  note: "パパ誕生" }
  ]

  # 特別な差分日の定義
  SPECIAL_DATE_COUNTS = [
      111, 222, 333, 444, 555, 666, 777, 888, 999,
      1111, 2222, 3333, 4444, 5555, 6666, 7777, 8888, 9999,
      11111, 22222, 33333, 44444, 55555, 66666, 77777, 88888, 99999,
      123, 1234, 12345
  ]

  # 「あとこれ」画面表示
  def index
    # 「あとこれだけ」用データを生成する
    @to_contents = create_to_contents
    # 「これだけ経ちました」用データを生成する
    @from_contents = create_from_contents
  end

  private

  # 「あとこれだけ」用データを生成する
  def create_to_contents
    today = Date.today
    TO_DATES.map{ |hash|
      next_date = calc_next_date(hash[:date])
      diff = calc_diff(today, next_date)
      create_to_content_hash(hash, diff)
    }.sort{ |v1, v2| v1[:diff] <=> v2[:diff] }
  end
  def create_to_content_hash(hash, diff)
    d = hash[:date]
    {
      include_year: yyyymmdd?(d), # 年月日表示か
      note: create_note(hash[:note], d),
      diff: diff,
      emphasize: calc_emphasize(diff, only_dd?(d))
    }
  end
  # noteと日付（YYYY/MM/DD or MM/DD or DD）から出力文字列を作成する
  def create_note(note, date)
    d = date.dup
    d = "#{date}日" if only_dd?(date)
    return "#{note}（#{d}）"
  end

  # 「これだけ経ちました」用データを生成する
  def create_from_contents
    today = Date.today
    contents = FROM_DATES.map do |hash|
      d = hash[:date]
      date = to_date(d.split("/"))
      diff_year_month = calc_year_month_diff(date, today)
      diff_date = calc_diff(date, today)
      create_from_content_hash(hash, diff_year_month, diff_date)
    end
  end
  def create_from_content_hash(hash, diff_year_month, diff_date)
    {
      from_date: hash[:date],
      note: hash[:note],
      diff_year_month: diff_year_month,
      show_diff_date: within_10_days?(diff_date) || within_special_days?(diff_date),
      diff_date: "(#{diff_date}日！)"
    }
  end

  # 100x-10 〜 100x に含まれているか
  def within_10_days?(diff)
    rest = diff % 100
    rest == 0 || 90 <= rest
  end
  
  # 特別な差分日の10日前に含まれているか
  def within_special_days?(diff)
    SPECIAL_DATE_COUNTS.each do |max|
      min = max - 10
      return true if (min <= diff && diff <= max)
    end
    false
  end

  # from-to間の差分を「○年○ヶ月」で算出する
  def calc_year_month_diff(from, to)
    years = 0
    months = 0
    loop {
      f = from + years.year + months.month
      if    (to - (f + 1.year))  >= 0 then years  += 1
      elsif (to - (f + 1.month)) >= 0 then months += 1
      else break
      end
    }
    "#{years}年#{months}ヶ月"
  end

  # 強調させるかどうかの判定を行い、クラス名を返却する
  def calc_emphasize(diff, is_date)
    case diff
    when 0..7
      return "last7"
    when 8..14
      return "last14"
    when 15..28
      return "last28" unless is_date # 年月日または月日の場合のみ
    end
    return ""
  end

  # YYYY/MM/DD or MM/DD or DD の文字列から
  # 直近の年月日を取得する
  def calc_next_date(str)
    today = Date.today

    ar = str.split("/")
    this_year = today.year
    this_month = today.month
    case ar.size
    when 3
      # 年月日
      return to_date(ar)
    when 2
      # 月日
      tmp = Date.new(this_year, ar[0].to_i, ar[1].to_i)
      return (tmp > today ? tmp : Date.new(this_year + 1, ar[0].to_i, ar[1].to_i))
    when 1
      # 日
      tmp = Date.new(this_year, this_month, ar[0].to_i)
      loop do
        return tmp if tmp > today
        tmp = tmp + 1.month
      end
    end
  end

  # "YYYY/MM/DD" 形式かどうか
  def yyyymmdd?(date_str)
    date_str.split("/").size == 3
  end

  # "DD" 形式かどうか
  def only_dd?(date_str)
    date_str.split("/").size == 1
  end

  # ["YYYY", "MM", "DD"] をDateに変換する
  def to_date(ar)
    Date.new(ar[0].to_i, ar[1].to_i, ar[2].to_i)
  end

  # from-to間の日数を算出する
  def calc_diff(from, to)
    (to - from).to_i
  end

end
