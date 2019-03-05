// // Code your JavaScript / jQuery solution here
var turn = 0;
var board = 0;


function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(square) {
  $(square).text(player());
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  let currentBoard = [];
  let winner = false;

  $('td').text(function(index, square) {
    currentBoard[index] = square;
  })

  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  winCombos.forEach(function(winCombo) {
    if (currentBoard[winCombo[0]] !== "" && currentBoard[winCombo[0]] === currentBoard[winCombo[1]] && currentBoard[winCombo[1]] === currentBoard[winCombo[2]]) {
      setMessage(`Player ${currentBoard[winCombo[0]]} Won!`);
      return winner = true;
    } else {
      return false;
    }
  })
  return winner;
}

function doTurn(square) {
  updateState(square);
  turn++;

  if (checkWinner()) {
    saveGame()
    resetBoard()
  } else if (turn === 9) {
    setMessage('Tie game.')
    saveGame()
    resetBoard()
  }
}

function saveGame() {
  var state = [];
  var data;

  $('td').text(function(index, square) {
    state.push(square);
  })

  data = { state: state };

  if (board) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${board}`,
      data: data
    })
  } else {
    $.post('/games', data, function(game) {
      board = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button>`)
      $('#gameid-' + game.data.id).on('click', function() {
        reloadGame(game.data.id);
      })
    })
  }
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  board = 0;
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  })

  $('#save').on('click', function() {
    saveGame();
  });

  $('#previous').on('click', function() {
    showPreviousGames();
  });

  $('#clear').on('click', function() {
    resetBoard();
  });
}

function showPreviousGames() {
  $('#games').empty();
  $.get('/games', function(savedGames) {
    if (savedGames.data.length) {
      savedGames.data.forEach(previousGame);
    }
  })
}

function previousGame(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', function() {
    reloadGame(game.id);
  })
}

function reloadGame(gameId) {
  document.getElementById('message').innerHTML = '';

  const request = new XMLHttpRequest;
  request.overrideMimeType('application/json');
  request.open('GET', `/games/${gameId}`, true);
  request.onload = function() {
    const data = JSON.parse(request.responseText).data;
    const id = data.id;
    const state = data.attributes.state;

    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }
    turn = state.join('').length;
    board = id;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  }
  request.send(null);
}

$(document).ready(function() {
  attachListeners();
})
