
$(function() {
  attachListeners();
});

var turn = 0;
var currentGame;
var winCombinations = [
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]],
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[0,2], [1,1], [2,0]]
];


function attachListeners() {
  $('td').click(function(event) {
    doTurn(event)
  });
  $('#games').click(function(event) {
    var state = $(event.target).data("state").split(",");
    var gameId = $(event.target).data("gameid");
    loadGame(state, gameId);   
  });
  $('#save').click(function(event) {
    save();
  });
  $('#previous').click(function(event) {
    retrieveOldGames();  
  });
}

function doTurn(event) {

  updateState(event);

  if (checkWinner() || checkTie()) {
    save(true);
    resetBoard();
  } 
  else {
    turn++;
  }
}

function checkWinner(array) {
  for (i = 0; i < winCombinations.length; i++) {
    if (inspectCells(winCombinations[i]) == true) {
      message('Player ' + player() + ' Won!');
      return true;
    }
  }
  return false;
}

function checkTie() {

  var tiedGame = true;

  $('td').each(function() {
    if ($(this).html().length <= 0) {
      tiedGame = false;
    }
  });

  if (tiedGame) {
    message("Tie game");
  }
  return tiedGame;
}

function updateState(event) {

  $(event.target).html(player());
}

function player() {
  return turn % 2 == 0 ? "X" : "O";
}

function inspectCells(winCombosArray) {

  for (var i = 0; i < winCombosArray.length; i++) {
    var winCombo = winCombosArray[i];
    var x = winCombo[0];
    var y = winCombo[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]');
 
    
    if (noMatch(selector)) {
      return false;
    }
  }
  return true;
}

function noMatch(selector) {

  return selector.text() != player();
}

function message(msg) {
  $('#message').html(msg);
}

function resetBoard() {
  $('td').html("");
  turn = 0;
}

function currentTurn(state) {
  var turn = 0;
  state.forEach(function(item) {
    if (item != "") {
      turn++;
    }
  })
  return turn;
}



function retrieveOldGames() {
  $.get('/games').done(function(response) {

    var games = response.games;
    var gamesListHtml = "";
    games.forEach(function(game) {
      gamesListHtml += '<li data-state="' + game["state"] + '" data-gameid="' + game["id"] + '" >' + game["id"] + '</li>';
    });
    $('#games').html(gamesListHtml);
  });
}

function save(resetCurrentGame) {
  var url, method;

  if (currentGame) {
    url = '/games/' + currentGame
    method = 'PATCH'
  }
  else {
    url = '/games'
    method = 'POST'
  }

  $.ajax({
    url: url,
    method: method,
    dataType: 'json',
    data: {
      game: {
        state: saveBoard()
      }
    },
    success: function(data) {
      if (resetCurrentGame) {
        currentGame = undefined;
      }
      else {
        currentGame = data.game.id;
      }
    }
  })
}

function loadGame(state, id) {
  fillBoard(state);
  currentGame = id;
  turn = currentTurn(state);
}

function saveBoard() {
  var stateArr = []
  $('td').each(function(index) {
    stateArr.push($(this).text())
  })
  return stateArr;
}

function fillBoard(tokens) {
  $('td').each(function(index) {
    $(this).text(tokens[index]);
  })
}