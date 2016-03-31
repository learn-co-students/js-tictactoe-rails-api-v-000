var turn = 0;
const WINNERS = [
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[0,2], [1,1], [2,0]]
];

var attachListeners = function() {
  $("tbody").click(function(event){
    doTurn(event)
  });
  $("#save").click(function(){
    saveGame()
  });
  $("#previous").click(function(){
    loadGames()
  });
  $("#games").click(function(event){
    loadGame(event)
  });
}

var doTurn = function(event) {
  if (event.target.textContent == "X" || event.target.textContent == "O") {
    $("#message").text("Try another move");
  } else {
    clearMessage();
    updateState(event);
    var winner = checkWinner();
    if (winner) {
      saveGame();
      resetBoard();
    }
    turn++;
  }
}

var updateState = function(event) {
  $(event.target).text(player());
}

var checkWinner = function(){
  var win;
  
  WINNERS.forEach(function(winner){
    var one = $('td[data-x="' + winner[0][0] + '"][data-y="' + winner[0][1] + '"]').text();
    var two = $('td[data-x="' + winner[1][0] + '"][data-y="' + winner[1][1] + '"]').text();
    var three = $('td[data-x="' + winner[2][0] + '"][data-y="' + winner[2][1] + '"]').text();
    if(one == two && two == three && one != " "){
      win = one;
    }
  });

  if(win){
    message("Player " + win + " Won!");
    return true;
  }

  if ($('td').text().match(/\s/)){
    return false;
  } 
  
  message("Tie game");
  return true;
  
}

var player = function(){
  if (turn % 2 == 0) {
    return "X";
  } else {
    return "O";
  }
}

var message = function(msg) {
  $('#message').text(msg);
}

var resetBoard = function() {
    $("td").text(" ");
    turn = -1;
}

var saveGame = function(){
  var gameboard = {};
  gameboard["board"] = $('td').text()
  var game = $.post('/games', $.param(gameboard));
}

var loadGames = function(){
  $('#games ul').text("");
  var games = $.get('/games', function(data){
    console.log(data);
  });

  games.done(function(data){
    $.each(data["games"], function(index, game){
      $('#games ul').append('<li>' + game + '</li>');
    });
  });
}

var loadGame = function(event){
  clearMessage();
  var game_id = event.toElement.textContent;
  var game = $.get('/games/' + game_id, function(data){
    data = data.state;
    console.log(data);
    var data_counter = 0;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        $('td[data-x="' + j + '"][data-y="' + i + '"]').text(data[data_counter]);
        data_counter++;
      }
    }
  });
}

var clearMessage = function(){
  $('#message').text('');
}


$(document).ready(function(){
  $("td").text(" ");
  attachListeners();
});
