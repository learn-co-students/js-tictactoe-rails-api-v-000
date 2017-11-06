// Code your JavaScript / jQuery solution here
const winningCombos = [
                        [0, 1, 2],
                        [3, 4, 5],
                        [6, 7, 8],
                        [0, 3, 6],
                        [1, 4, 7],
                        [2, 5, 8],
                        [0, 4, 8],
                        [2, 4, 6]
                      ];

var turn = 0;
var currentGame = 0;

$(document).ready(function() {
  attachListeners();
});

function player() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}

function updateState(square) {
  $(square).text(player());
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  let board = {};
  let winner = false;

  $('td').text(function(index, square) {
    board[index] = square;
  });

  winningCombos.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    clearBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    clearBoard();
  }
}

function saveGame() {
  let state = [];

  $('td').text((index, square) => {
    state.push(square)
  });

  let gameData = { state: state };

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${currentGame}">Game ${currentGame}</button><br>`);
      $("#gameid-" + currentGame).on('click', function() {
        loadGame(currentGame);
      });
    });
  }
}

function clearBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', function() {
    saveGame();
  });
  $('#previous').on('click', function() {
    displayPreviousGames();
  });
  $('#clear').on('click', function() {
    clearBoard();
  });
}

function displayPreviousGames() {
  $('#games').empty();
  $.get('/games', function(savedGames) {
    if (savedGames.data.length) {
      savedGames.data.forEach(function(game) {
        $('#games').append(`<button id="gameid-${game.id}">Game ${game.id}</button><br>`);
        $(`#gameid-${game.id}`).on('click', function() {
          loadGame(game.id);
        });
      });
    }
  });
}

function loadGame(gameID) {
  document.getElementById('message').innerHTML = '';

  $.get(`/games/${gameID}`, function(game) {
    const state = game.data.attributes.state;
    const id = game.data.id;

    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }

    turn = state.join('').length;
    currentGame = id;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  });
}
