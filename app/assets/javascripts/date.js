
/**
 * 画面初期化
 */
function initializePage()
{
  /* いついつから○○日経過（年月日,内容） */
  var FROM_DATE_ARRAY = [
    {date:"2012/11/26", note:"こよ誕生"},
    {date:"2011/4/29",  note:"パパ・ママ結婚"},
    {date:"2010/10/16", note:"付き合って"},
    {date:"2010/8/28", note:"出会って"},
    {date:"1984/6/11",  note:"ママ誕生"},
    {date:"1981/10/5",  note:"パパ誕生"}
  ];

  /* いついつまで後○○日（年や月省略可） */
  var TO_DATE_ARRAY = [
    {date:"6/11",  note:"ママ誕生日"},
    {date:"10/5",  note:"パパ誕生日"},
    {date:"11/26", note:"こよ誕生日"},
    {date:"12/31", note:"大晦日"},
    {date:"4/29", note:"結婚記念日"},
    {date:"2021/4/29", note:"結婚して10年"},
    {date:"2032/11/26", note:"こよ二十歳"},
    {date:"10/16", note:"パパママ記念日"},
    {date:"26", note:"こよ月齢"}
  ];

	var ii, len,
		html,
		today = convertToDateOfYearMonthDate(new Date()),
		toArray = [];

	/*
	 * 「これだけ経ちました」の作成
	 * ・年月の差を算出
	 */
	//HTML作成
	html = '<table>';
	for(ii = 0, len = FROM_DATE_ARRAY.length; ii < len; ii++) {
		html += '<tr>';
		html += createHtmlOfFOR(FROM_DATE_ARRAY[ii], calcDiffYearAndMonth(today, toDate(FROM_DATE_ARRAY[ii].date)));
		html += '</tr>';
	}
	html += '</table>';
	$("#fromContents").html(html);

	/*
	 * 「あとこれだけ」のHTML作成
	 * ・日の差を算出
	 * ・昇順でソート
	 */
	//日の差の算出と同時にHTML作成
	for(ii = 0, len = TO_DATE_ARRAY.length; ii < len; ii++) {
		toArray[ii] = {};
		var diffDate = calcDiffDate(toDate(TO_DATE_ARRAY[ii].date), today);
		toArray[ii].diffDate = diffDate;
		toArray[ii].html = createHtmlOfTO(TO_DATE_ARRAY[ii], diffDate);
	}

	//昇順ソート
	toArray.sort(
		function(a,b){
			var ad = a.diffDate;
			var bd = b.diffDate;
			if( ad < bd ) return -1;
			if( ad > bd ) return 1;
			return 0;
		}
	);

	//HTML表示
	html = '<table>';
	for(ii = 0, len = toArray.length; ii < len; ii++) {
		html += '<tr>';
		html += toArray[ii].html;
		html += '</tr>';
	}
	html += '</table>';
	$("#toContents").html(html);
}

/**
 * HTML文の作成（「これだけ経ちました」用）
 */
function createHtmlOfFOR(date, diff)
{
	return '<td>' + date.date + ' の ' + date.note + '</td>' +
		   '<td style="width:8px"><br></td>' +
		   '<td>から</td>' +
		   '<td style="width:8px"><br></td>' +
		   '<td align="right">' + diff.year + '年' + diff.month + 'ヶ月' +
		   (isWithinTenDays(diff.date) || isWithinSpecialDays(diff.date) ? '<br>(' + diff.date + '日！)' : '') +
//		   '<br>(' + diff.date + '日！)' +
		   '</td>';
}

/**
 * 100x-10 〜 100x に含まれているかどうか
 */
function isWithinTenDays(date)
{
	var rest = date % 100;
	return rest == 0 || 90 <= rest;
}

/**
 * 特別な日の10日以内に含まれているか
 */
function isWithinSpecialDays(date)
{
  /* 特別な日数 */
  var SPECIAL_DATE_COUNT_ARRAY = [
      111, 222, 333, 444, 555, 666, 777, 888, 999,
      1111, 2222, 3333, 4444, 5555, 6666, 7777, 8888, 9999,
      11111, 22222, 33333, 44444, 55555, 66666, 77777, 88888, 99999,
      123, 1234, 12345
  ];

	var ii, len,
	    min, max;

	for(ii = 0, len = SPECIAL_DATE_COUNT_ARRAY.length; ii < len; ii++) {
		max = SPECIAL_DATE_COUNT_ARRAY[ii];
		min = max - 10;

		if(min <= date && date <= max) {
			return true;
		}
	}

	return false;
}

/**
 * HTML文の作成（「あとこれだけ」用）
 */
function createHtmlOfTO(date, diff)
{
	var ret,
		emphasizedClass;

	if(includeYear(date.date)) {
		//年月日の場合
		ret = '<td>' + date.note + '（' + date.date + '）</td>';
		emphasizedClass = emphasize(diff);

	} else if(includeMonth(date.date)) {
		//月日の場合
		ret = '<td>次の ' + date.note + '（' + date.date + '）</td>';
		emphasizedClass = emphasize(diff);

	} else {
		//日の場合
		ret = '<td>次の ' + date.note + '（' + date.date + '日）</td>';
		emphasizedClass = emphasizeForDate(diff);
	}

	return ret +
		   '<td style="width:8px"><br></td>' +
		   (
		     diff == 0 ?
		       '<td colspan="4" class="today">は今日だよ！</td>'
		       :
			   '<td>まで</td>' +
			   '<td style="width:8px"><br></td>' +
	  		   '<td class="pull-right' + emphasizedClass + '">' + diff + ' 日</td>' +
			   '<td style="width:8px"><br></td>'
		   );
}

/**
 * 7以下の場合 ".last7"、14以下の場合 ".last14" 、28以下の場合 ".last28" 、それ以上は空文字を返却
 */
function emphasize(num)
{
	if(num <= 7) {
		return " last7";
	} else if(num <= 14) {
		return " last14";
	} else if(num <= 28) {
		return " last28";
	} else {
		return "";
	}
}

/**
 * 7以下の場合 ".last7"、14以下の場合 ".last14"、それ以上は空文字を返却
 */
function emphasizeForDate(num)
{
	if(num <= 7) {
		return " last7";
	} else if(num <= 14) {
		return " last14";
	} else {
		return "";
	}
}

/**
 * 差分を年月日で算出する
 */
function calcDiffYearAndMonth(date1, date2)
{
	var diff = {};

	//年月を算出
	diff.year = date1.getFullYear() - date2.getFullYear();
	diff.month = date1.getMonth() - date2.getMonth();

	if(date1.getDate() - date2.getDate() < 0) {
		//日がまだの場合、月を繰り下げ
		diff.month -= 1;
	}

	if(diff.month < 0) {
		//月がマイナスの場合、年を繰り下げ
		diff.month += 12;
		diff.year -= 1;
	}

	//日を算出
	diff.date = calcDiffDate(date1, date2);

	return diff;
}

/**
 * 差分を日で算出する
 */
function calcDiffDate(date1, date2)
{
	date1 = convertToDateOfYearMonthDate(date1);
	date2 = convertToDateOfYearMonthDate(date2);

	return Math.floor((date1.getTime() - date2.getTime()) / ONE_DAY_IN_MILLISECOND);
}

/**
 * 年月日／月日／日をDate型に変換する
 */
function toDate(date)
{
	var ar = date.split("/");

	var today =  convertToDateOfYearMonthDate(new Date()),
		thisYear = today.getFullYear(),
		thisMonth = today.getMonth(),
		retDate;

	if(includeYear(date)) {
		//年月日の場合はそのまま計算
		return new Date(ar[0], ar[1]-1, ar[2]);

	} else if(includeMonth(date)) {
		//月日の場合、今年か来年かの判定を行う
		retDate = new Date(thisYear, ar[0]-1, ar[1]);

		if(today.getTime() <= retDate.getTime()) {
			//今年
			return retDate;

		} else {
			//来年
			return new Date(thisYear+1, ar[0]-1, ar[1]);
		}

	} else {
		//日の場合、今月から来月かの判定を行う
		retDate = new Date(thisYear, thisMonth, ar[0]);

		if(today.getTime() <= retDate.getTime()) {
			//今月
			return retDate;

		} else {
			//来月
			thisMonth++;
			if(thisMonth >= 12) {
				//来年
				thisMonth = 0;
				thisYear++;
			}

			return new Date(thisYear, thisMonth, ar[0]);
		}
	}

}

/**
 * 日付に年が含まれているかどうか
 */
function includeYear(date)
{
	return 3 <= date.split("/").length;
}

/**
 * 日付に月が含まれているかどうか
 */
function includeMonth(date)
{
	return 2 <= date.split("/").length;
}

/**
 * 年月日情報のみのDate型に変換する（時間・分・秒・ミリ秒情報を削除する）
 */
function convertToDateOfYearMonthDate(date)
{
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
