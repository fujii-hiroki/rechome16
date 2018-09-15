// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery.min.js
//= require bootstrap
//= require rails-ujs
//= require activestorage
//= require turbolinks
//= require_tree .
//
/** 一日のミリ秒 **/
var ONE_DAY_IN_MILLISECOND = 24 * 60 * 60 * 1000;

/** ゼロ詰め用配列 **/
var ZERO_ARRAY = ["00", "0", ""];


/**
 * シャドウを表示する
 */
function makeShadow()
{
	var height = $('html').height();
	$('#shadow').css('height', height).css('display', 'block');
}

/**
 * シャドウを削除する
 */
function clearShadow()
{
	$("#shadow").css('display', 'none');
}

/**
 * 現在日時を設定する
 */
function setCurrentDate()
{
	var currentDate = new Date();
	$('#inputDate').attr('value', getYYYYHHMM(currentDate));
}

/**
 * 1日前の日付を設定する
 */
function toPrevious()
{
	var currentDate = new Date(getCurrentDisplayDate().getTime() - ONE_DAY_IN_MILLISECOND);
	$('#inputDate').attr('value', getYYYYHHMM(currentDate));
}

/**
 * 1日後の日付を設定する
 */
function toNext()
{
	var currentDate = new Date(getCurrentDisplayDate().getTime() + ONE_DAY_IN_MILLISECOND);
	$('#inputDate').attr('value', getYYYYHHMM(currentDate));
}

/**
 * 現在表示中の日時を取得する
 */
function getCurrentDisplayDate()
{
	var date = $('#inputDate').attr('value');
	var dateArray = date.split("-");
	return new Date(dateArray[0], dateArray[1]-1, dateArray[2], 0, 0, 0);
}

/**
 * Date型を YYYY-HH-MM の文字列に変換する
 */
function getYYYYHHMM(date)
{
	return date.getFullYear()+'-'+addZero(date.getMonth()+1)+'-'+addZero(date.getDate());
}

/**
 * 左にゼロ詰めし2桁にする
 */
function addZero(str)
{
	return ZERO_ARRAY[String(str).length] + str;
}


