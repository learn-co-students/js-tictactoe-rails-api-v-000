// Code your JavaScript / jQuery solution here
$(function () {

  $('#save').click(function(event) {
    var values = []

    for (let i = 0; i < 9; i++) {
      values.push(document.getElementsByTagName("td")[i]["textContent"]);
    }
    var gameId = document.getElementsByTagName("table").game

    if (gameId) {
      $.ajax({
        url: '/games/' + gameId,
        method: 'patch',
        data: {state: values}
      });
    } else {
    $.ajax({
      url: '/games',
      method: 'post',
      data: {state: values}
    }).done(function(data){
      document.getElementsByTagName("table").game = data["data"]["id"]
    })

  }
})

  $('#clear').click(function() {

    var x = document.getElementsByTagName("td")
    var gameId = document.getElementsByTagName("table").game
    if (gameId) {
      gameId = ""
      $(x).empty();
      turn = 0;
      $.post('/games').done();
    } else {
      $(x).empty();
      turn = 0;
    }
  });

  $('#previous').click(function() {
    var posting = $.get('/games');
    posting.done(function(data) {
      var games = data["data"]
      $("#games").empty()
      games.forEach(function(game){
      var button = $('<button type="button" id="game-'+ game["id"] +'">Game ' + game["id"] + '</>');
      $("#games").append(button)})
    });
  });


  $("#games").on('click', ":button[id^='game-']", function() {
    var posting = $.get('/games/' + this.id.substring(5));
    posting.done(function(data) {
      var game = data["data"]["attributes"]["state"]
      document.getElementsByTagName("table").game = this.url.substring(7)
      $("td:eq(0)").text(game[0])
      $("td:eq(1)").text(game[1])
      $("td:eq(2)").text(game[2])
      $("td:eq(3)").text(game[3])
      $("td:eq(4)").text(game[4])
      $("td:eq(5)").text(game[5])
      $("td:eq(6)").text(game[6])
      $("td:eq(7)").text(game[7])
      $("td:eq(8)").text(game[8])
      if (checkWinner() === true) {
        turn = game.filter(Boolean).length - 1;
      } else {
        turn = game.filter(Boolean).length;
      }
    });
  });

  attachListeners();
});

  function attachListeners() {
      $('td').click(function() {
        doTurn(this);
      })}

var turn = 0;

function player(){
  if (turn % 2 === 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(input) {
  if (input.innerHTML === "") {
  input.innerHTML = player();
} else {
  messageCall("Choose another square")
  turn -= 1
}
}

function messageCall(string) {
  return document.getElementById("message").innerHTML = string
}

var winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

function checkWinner() {
  var values = []

  for (let i = 0; i < 9; i++) {
    values.push(document.getElementsByTagName("td")[i]["textContent"]);
  }

  for (win of winCombinations) {
    if (values[win[0]] === values[win[1]] && values[win[1]] === values[win[2]] && values[win[0]] != ''){
      messageCall('Player ' + player() + ' Won!')
      $("#save").click()
      return true }
    } return false
}

function doTurn(input) {
  updateState(input)
  if (checkWinner() === false) {
    turn +=1
  } else {
    $("#clear").click()
  }

  if (turn === 9 && checkWinner() === false){
    $("#save").click()
    messageCall("Tie game.");
    $("#clear").click()
  }
}
