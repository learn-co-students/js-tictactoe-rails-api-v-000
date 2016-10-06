const WINNING_COMBOS = [[0,1,2],
[3,4,5],[6,7,8],[0,3,6],[1,4,7],
[2,5,8],[0,4,8],[2,4,6]]
var turn = 0;
var currentGame = 0;

$(document).ready(function() {
  attachListeners();
});

function player() {
  if(turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}

function doTurn(square) {
  updateState(square);
  turn++;
  if(checkWinner()) {
    console.log('We have a winner!');
    saveGame();
    resetBoard();
  } else if(turn === 9) {
    message("Tie game");
    saveGame();
    resetBoard();
  }
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function attachListeners() {
  $('td').on('click', function() {
    if(!$.text(this)) {
      doTurn(this);
    }
  });
  $('#save').on('click', function() {
    saveGame();
  });
  $('#previous').on('click', function() {
    showPreviousGames();
  });
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text(function(index, square) {
    board[index] = square;
  })

  WINNING_COMBOS.some(function(combo) {
    if(board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      message("Player " + board[combo[0]] + " Won!");
      return winner = true;
    }
  })
  return winner;
}

function updateState(square) {
  var token = player();
  $(square).text(token);
}

function message(string) {
  $('#message').text(string);
}

function saveGame() {
  var state = [];
  $('td').text(function(index, square) {
    state.push(square);
  });

  var gameData = {
    game: {
      state: state
    }
  };

  if(currentGame) {
    $.ajax({
      type: "PATCH",
      url: "/games/" + currentGame,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game['id'];
      $('#games').append("<button id='gameid-" + game['id'] + "'>" + game['id'] + "</button><br>");
      $("#gameid-" + game['id']).on('click', function() {
        reloadGame(game['id']);
      });
    });
  }
}

function showPreviousGames() {
  $('#games').empty();
  $.get('/games', function(savedGames) {
    console.log(savedGames);
    savedGames.forEach(function(game) {
      $('#games').append("<button id='gameid-" + game['id'] + "'>" + game['id'] + "</button><br>");
      $("#gameid-" + game['id']).on('click', function() {
        reloadGame(game['id']);
      });
    });
  });
}

function reloadGame(gameID) {
  $.get("/games/" + gameID, function(game) {
    var index = 0;
    for(var x = 0; x < 3; x++) {
      for(var y = 0; y < 3; y++) {
        $("[data-x='"+x+"'][data-y='"+y+"']").text(game["state"][index]);
        index++;
      }
    }
    turn = $('td').text().length;
    currentGame = gameID;
  });
}