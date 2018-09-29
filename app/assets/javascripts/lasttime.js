$(function() {
  setCurrentDate();

  $("#doneButton").on('click', function() {
    onClickDone();
  });

  $("#registButton").on('click', function() {
    onClickRegist();
  });
});

// 「やったよ！」ボタン押下時
function onClickDone()
{
  //アラート日数が入力されていない場合、ここで終了
  $date = $('#inputDate')
  if( $date.attr("value").length <= 0 ) {
    return;
  }

  id = $('#action option:selected').val()
  date = $date.val()
  doneActionInner(id, date)
}

// チェックボタン押下時
function doneAction(id, targetText, doneDate)
{
  var text = '「' + targetText + '」完了？';
  if(window.confirm(text)) {
    doneActionInner(id, doneDate);
  }
}

// アクション完了時の共通処理
function doneActionInner(id, doneDate)
{
  makeShadow();

  $.ajax({
    type: 'post',
    url: '/lasttime/update',
    data: 'id=' + id + '&inputDate=' + doneDate,
    success: function(data){
      clearShadow();

      alert_id = "errorAlert"
      if(data) {
        // テーブルを最新の状態に更新する
        $table = $("#recordTable")
        $table.after(data)
        $table.remove()

        alert_id = "doneAlert"
      }

      fadeInAndOut($("#" + alert_id))
    }
  });
}

// 「登録する！！」ボタン押下時
function onClickRegist()
{
  // 名称が入っていない場合、ここで終了
  actionName = $("#newAction").val()
  if( actionName.length <= 0 ) {
    return;
  }

  // 繰り返し日数が1未満の場合、ここで終了
  interval = $("#interval").val()
  if(!$.isNumeric(interval) || Number(interval) == 0) {
    return;
  }

  registActionInner(actionName, interval)
}

// アクション登録時の処理
function registActionInner(name, intervalDate)
{
  makeShadow();

  $.ajax({
    type: 'post',
    url: '/lasttime/create',
    data: 'name=' + name + '&interval=' + intervalDate,
    success: function(data){
      clearShadow();

      alert_id = "errorAlert"
      if(data) {
        // テーブルを最新の状態に更新する
        $table = $("#recordTable")
        $table.after(data)
        $table.remove()

        alert_id = "registedAlert"
      }

      fadeInAndOut($("#" + alert_id))
    }
  });
}


//削除する
function deleteAction(id, targetText)
{
  var text = '「' + targetText + '」を消してもOK？';

  if(window.confirm(text)) {
    makeShadow();
    deleteInner(id);
  }
}
function deleteInner(id)
{
  $.ajax({
    type: 'get',
    url: '/lasttime/delete/' + id,
    success: function(data){
      clearShadow();

      alert_id = "deleteErrorAlert"
      if(data) {
        // テーブルを最新の状態に更新する
        $table = $("#recordTable")
        $table.after(data)
        $table.remove()

        alert_id = "deletedAlert"
      }

      fadeInAndOut($("#" + alert_id))
    }
  });
}

// ボタンのfadein/out処理を行う
function fadeInAndOut($alert, interval = 7000)
{
  $alert.fadeIn();
  setTimeout(function() {
    $alert.fadeOut();
  }, interval);
}
