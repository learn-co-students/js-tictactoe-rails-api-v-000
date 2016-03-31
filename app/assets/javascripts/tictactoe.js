var turn = 0;
var currentGame;
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
    var board = $(event.target).data("state").split(',');
    var gameId = $(event.target).data("gameid");
    loadGame(board, gameId);
  });
}

var doTurn = function(event) {
  if (event.target.textContent == "X" || event.target.textContent == "O") {
    $("#message").text("Try another move");
  } else {
    updateState(event);
    var winner = checkWinner();
    var tie = checkTie();
    if (winner || tie) {
      saveGame(true);
      resetBoard();
    } else {
      turn++;
    } 
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
    if(one == two && two == three && one != ""){
      win = one;
    }
  });
  if(win){
    message("Player " + win + " Won!");
    return true;
  } else {
    return false;
  }
}

var checkTie = function(){
  if (checkWinner()) {
    return false;
  } else if ($('td:empty').length > 0) {
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
    $("td").text("");
    turn = 0;
}

var saveGame = function(reset){
  var url;
  var method;
  if(currentGame) {
    url = '/games/' + currentGame;
    method = "PATCH"
  } else {
    url = '/games';
    method = "POST"
  }

  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: {
        state: getBoard()
      }
    },
    success: function(data){
      if(reset){
        currentGame = undefined;
      } else {
        currentGame = data.game.id;
      }
    }
  })
}

var getBoard = function() {
  var cells = [];
  $("td").each(function(i) {
    cells.push($(this).text())
  })
  return cells;
}

var loadGames = function(){
  $.getJSON('/games', function(data){
    displayGames(data.games);
  });
}

var displayGames = function(data){
  var games = $();
  data.forEach(function(game) {
    games = games.add(displayGame(game));
  });
  $("#games").html(games);
}

var displayGame = function(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

var loadGame = function(board, id){
  $("td").each(function(i) {
    $(this).text(board[i]);
  });
  currentGame = id;
  turn = getTurn(board);
}

var getTurn = function(board){
  var turn = 0;
  board.forEach(function(cell) {
    if(cell != "") {
      turn++;
    }
  });
  return turn;
}

$(document).ready(function(){
  attachListeners();
});
