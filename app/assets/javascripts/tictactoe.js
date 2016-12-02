// Main Tic Tac Toe functions

var turn = 0;
var currentGame = 0;
var isNewGame = true;

function attachListeners() {
  // Head of program, sets eventListeners for click events
  $('td').on('click', function(event) {
    doTurn(event);
  });
  $('#games').on('click', function(event) {
    loadGame(event);
  });
  $('#save').on('click', function(event) {
    handleGameSave(event);
  });
  $('#previous').on('click', function(event) {
    getPreviousGame();
  });

}

function doTurn(event) {
  // Game loop, responds to event and checks for game end
  updateState(event);
  gameStatus = checkForGameOver();
  if (gameStatus) {
    saveGame(getGameData())
    resetBoard();
  } else {
    turn += 1;
  }

}

function checkForGameOver() {
  // Checks for game ending event, directly called by game loop

  if (checkWinner() || checkForTie(getGameData())) {

    return true;
  }
  return false;
}

function checkWinner() {
  // Checks board state against winning combinations,
  // returns true or false

  var winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  var board = getGameData();
  for (var combo in winningCombos) {
    var position0 = winningCombos[combo][0];
    var position1 = winningCombos[combo][1];
    var position2 = winningCombos[combo][2];

    if (board[position0] === board[position1] && board[position1] === board[position2] && board[position0] !== "") {
      message("Player " + board[position0] + " Won!");
      return true;
    }
  }
  return false;
}

function checkForTie(board) {
  // Checks for a tie game, returns true or false
  // called by checkForGameOver()

  for (var element in board) {
    if (board[element] === "") {
      return false;
    }
  }
  message("Tie game");
  return true;
}

function resetBoard() {
  // Resets board and turn variable
  $("td").html("");
  turn = 0;
  currentGame = 0;
  isNewGame = true;
}

function updateState(event) {
  // Writes player token to cell clicked, accepts event from
  // eventListener on board.
  if (checkCell(event)) {
    $(event.currentTarget).text(player());
  }

}

function checkCell(event) {
  if ($(event.currentTarget).text() === "") {
    return true;
  } else {
    return false;
  }
}

function player() {
  // updates player token based on turn. X goes first.

  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function message(message) {
  // writes whether game is a tie, or which player won (by token).
  $("#message").text(message);
}

function getGameData() {
  // function grabs board state and returns that state, used
  // to check for win conditions.

  var data = [];
  $("td").each(function(index, cell) {
    data.push($(this).text());
  })
  return data;
}

/////////////////
// Persistence //
/////////////////

function getPreviousGame() {
  $.get('/games').done(function(response) {
    // console.log(response["games"]);
    var games = response["games"];
    var gamesList = "";
    $.each(games, function(index, game) {
      gamesList += '<li data-gameid="' + game["id"] + '" >' + game["id"] + '</li>';
    })
    $("#games").html(gamesList);
  });
}

function handleGameSave() {
  var data = getGameData();
  if (isNewGame) {
    saveGame(data);
  } else {
    updateGame(data);
  }
}

function saveGame(data) {
  // data = data.join(", ");
  isNewGame = false;
  $.post('/games', { game: { state: data } }).done(function(response) {
    currentGame = response.game.id;
  });
}

function loadGame(event) {
  var gameId = $(event.target).data("gameid");
  $.get('/games/' + gameId).done(function(data) {
    // console.log(data);
    var gameState = data.game.state;
    // console.log(data.game.state);
    $("td").each(function(index, cell) {

      $(this).text(gameState[index]);
    });
    currentGame = gameId;
    isNewGame = false;
  });
}

function updateGame(data) {
  isNewGame = false;
  $.ajax({
    url: '/games/' + currentGame,
    method: 'PATCH',
    data: {
      game: {
        state: data
      }
    }
  }).done(function(response) {
    currentGame = response.game.id;
  });
}

/////////////////////////////
// Start game on page load //
/////////////////////////////
$(function() {
  attachListeners();
});
