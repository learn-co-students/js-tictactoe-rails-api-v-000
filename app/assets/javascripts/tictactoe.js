var WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

var turn = 0;
var currentGame = 0;

$(document).ready(function() {
    attachListeners();
});

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(square) {
  var currentPlayer = player();
  $(square).text(currentPlayer);
}

function setMessage(string) {
  $("#message").text(string);
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text(function (index, square) {
    board[index] = square;
  })

  WINNING_COMBOS.forEach(function(position) {
    if(board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  })
  return winner;
}

function doTurn(square) {
  updateState(square);
  turn++;

  if (checkWinner()) {
    saveGame();
    clearBoard();
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame();
    clearBoard();
  }
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => clearBoard());
}

function clearBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function showPreviousGames() {
  $('#games').empty();
  $.get('/games', function(savedGames) {
    if (savedGames.data.length > 0) {
      savedGames.data.forEach(function(game) {
        $('#games').append(`<button id="game-${game.id}">${game.id}</button>`);
        $(`#game-${game.id}`).on('click', () => loadGame(game.id));
      })
    }
  })
}

function loadGame(game) {
  $('#message').empty();
  $.get(`/games/${game}`, function(game) {
    var currentId = game.data.id;
    var currentState = game.data.attributes.state;

    var i = 0;
    for (var y = 0; y < 3; y++) {
      for (var x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[i];
        i++
      };
    };
    turn = currentState.join('').length;
    currentGame = currentId;
  })
}

function saveGame() {
  var state = [];
  $('#td').text((index, square) => {
    state.push(square);
  });

  if (currentGame) {
    $.ajax({
      url: `/games/${currentGame}`,
      data: {state: state},
      type: 'PATCH'
    });
  } else {
    $.post('/games', {state: state}, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => loadGame(game.data.id));
    })
  }
}
