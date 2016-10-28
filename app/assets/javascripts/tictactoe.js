$(function(){
  attachListeners();
});

var turn = 0;
var currentGame;
var counter = 0;
//var exboard = "<table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table>"
//WIN_COMBINATIONS = [
//  [0, 1, 2], 
//  [3, 4, 5], 
//  [6, 7, 8], 
//  [0, 3, 6], 
//  [1, 4, 7], 
//  [2, 5, 8], 
//  [6, 4, 2], 
//  [0, 4, 8]  
//  ]
var winCombinations = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[1,1],[2,2]], [[0,0],[0,1],[0,2]], [[2,0],[2,1],[2,2]], [[1,0],[1,1],[1,2]], [[2,0],[1,1],[0,2]]];
var cells = ['[data-x="0"][data-y="0"]', '[data-x="1"][data-y="0"]', '[data-x="2"][data-y="0"]', '[data-x="0"][data-y="1"]', '[data-x="1"][data-y="1"]', '[data-x="2"][data-y="1"]', '[data-x="0"][data-y="2"]', '[data-x="1"][data-y="2"]', '[data-x="2"][data-y="2"]'];
//

function attachListeners() {
  $('[data-x="0"][data-y="0"]').click(function(event) {doTurn(event); });
  $('[data-x="1"][data-y="0"]').click(function(event) {doTurn(event); });
  $('[data-x="2"][data-y="0"]').click(function(event) {doTurn(event); });
  $('[data-x="0"][data-y="1"]').click(function(event) {doTurn(event); });
  $('[data-x="1"][data-y="1"]').click(function(event) {doTurn(event); });
  $('[data-x="2"][data-y="1"]').click(function(event) {doTurn(event); });
  $('[data-x="0"][data-y="2"]').click(function(event) {doTurn(event); });
  $('[data-x="1"][data-y="2"]').click(function(event) {doTurn(event); });
  $('[data-x="2"][data-y="2"]').click(function(event) {doTurn(event); });
  $('#previous').click(function(event) {getGames(event); });
  $('#save').click(function(event) {saveHandler(event); });
  $('div#games').click(function(event) {loadGame(event); });
}

function doTurn(event) {
  updateState(event);
  if (checkWinner() == true) {
    gameReset();
  } else {
    turn++;
  }
}

function player() {
  if ((turn % 2) == 0) {
    return "X";
  } else if ((turn % 2) == 1){
    return "O";
  }
}

function updateState(event) {
  $(event.target).html(player());
}

function checkWinner() {
  var winner = "none";
  for (var i = 0; i < winCombinations.length; i++) {
    combo = winCombinations[i]; 
    locA = $(`[data-x="${combo[0][0]}"][data-y="${combo[0][1]}"]`).html();
    locB = $(`[data-x="${combo[1][0]}"][data-y="${combo[1][1]}"]`).html();
    locC = $(`[data-x="${combo[2][0]}"][data-y="${combo[2][1]}"]`).html();
    if (locA == "X" && locB == "X" && locC == "X") {
      winner = "X";
    } else if (locA == "O" && locB == "O" && locC == "O") {
      winner = "O";
    } 
  }
  if (winner == "X") {
    message("Player X Won!");
    return true;
  } else if (winner == "O") {
    message("Player O Won!");
    return true;
  } else if (checkTie() != false ) {
    message("Tie game");
    return true;
  } else {
    return false;
  }
}

function checkTie() {
  for (var i = 0; i < cells.length; i++) {
    value = $(cells[i]).html();
    if (value != "X" && value != "O") {
      return false;
    } 
  }
}

function message(string) {
  $("#message").text(string);
}

function gameReset() {
  turn = 0;
  counter = 0;
  saveGame();
  for (var i = 0; i < cells.length; i++) {
    $(cells[i]).html("");
  }
}

function getGames(event) {
  event.preventDefault();
  var getting = $.get('/games');
     
  getting.done(function(data) {
    var games = data["games"];
    var array = "";
    for (var i = 0; i < games.length; i++) {
      array += `<p data-gameid="${games[i]["id"]}">` + "ID: " + `${games[i]["id"]}` + "  " + "State: " + `${games[i]["state"]}` + "</p>";
    }
    $("#games").html(array);
  });
}

function currentValues() {
  var values = [];
  for (var i = 0; i < cells.length; i++) {
    values.push($(cells[i]).html());
  }
  return values;
}

function saveGame() {
  var game = {
        game: {
          state: currentValues()
        }
      }
  var posting = $.post('/games', game);
  posting.done(function(data) {
    currentGame = data["game"]["id"]
  });
}

function updateGame(event) {
   var game = {
        game: {
          state: currentValues()
        }
      }
      if (currentGame == 0) {
        currentGame++;
      }
  $.ajax({
            url : '/games/' + currentGame,
            type : 'PATCH',
            data : game
        });
}

function saveHandler(event) {
  event.preventDefault();
  if (counter == 0) {
    counter ++;
    saveGame();
  } else {
    updateGame(event);
  }

}

function loadGame(event) {
  event.preventDefault();
  var gameid = $(event.target).data("gameid");
  var getting = $.get('/games/' + gameid);
  getting.done(function(data) {
    console.log(data["game"]["state"]);
    for (var i = 0; i < cells.length; i++) {
      $(cells[i]).html(data["game"]["state"][i]);
    }
  });
  
}