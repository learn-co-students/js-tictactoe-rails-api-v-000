
const WIN_COMBINATIONS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

var turn = 0;
var currentGameId = 0;

$(document).ready(function() {
  attachListeners();
});

var player = function() {
  return turn % 2 === 0 ? 'X' : 'O';
}

function updateState(square) {
  $(square).text(player());
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  var currentBoard = {};
  winner = false;

  $('td').text(function(index, square) {
    currentBoard[index] = square;
  });

  return WIN_COMBINATIONS.some(function(combination) {
    if (currentBoard[combination[0]] !== "" && currentBoard[combination[0]] === currentBoard[combination[1]] && currentBoard[combination[1]] === currentBoard[combination[2]]) {
      setMessage(`Player ${currentBoard[combination[0]]} Won!`);

      return true;
    }

    return false;
  });
}

function doTurn(square) {
  updateState(square);
  turn++;

  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame();
    resetBoard();
  }
}

function attachListeners() {
  $('td').on('click', function() {
    if ($.text(this) === "" && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

function saveGame() {
  var currentState = [];

  $('td').text(function(index, square) {
    currentState[index] = square;
  });

  if (currentGameId !== 0) {
    $.ajax({
      url: `/games/${currentGameId}`,
      type: 'PATCH',
      data: { state: currentState }
    });
  } else {
    $.post('/games', { state: currentState}, function(game) {
      currentGameId = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', function() {
        reloadGame(game.data.id)
      });
    });
  }
}

function showPreviousGames() {
  $('#games').empty();

  $.get('/games', function(games) {
    games.data.forEach(function(game) {
      $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
      $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
    });
  });
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGameId = 0;
}

function reloadGame(gameId) {
  currentGameId = gameId;
  $.get('/games/' + gameId, function(game) {
    game.data.attributes.state.forEach(function (token, index) {
      $('td').eq(index).text(token);
    });
    
    turn = game.data.attributes.state.join('').length;
  });
}
