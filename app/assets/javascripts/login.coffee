# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/
$ ->
  $("#loginButton").on 'click', ->
    onClickLogin()

# ログインボタン押下時
onClickLogin = ->
  name = $("#name").val()
  pw = $("#pw").val()

  $.ajax {
    type: 'post',
    url: './login/login',
    data: 'name=' + name + '&pw=' + pw,
    success: (data) ->
      debugger
      window.location = data.url if data.url
  }
