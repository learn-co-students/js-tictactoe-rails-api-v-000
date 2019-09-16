// Code your JavaScript / jQuery solution here
const WIN_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var currentGame = 0;

$(document).ready(function() {
  attachListeners();
});


function player() {
  return (window.turn % 2 === 0 || !window.turn) ? "X" : "O"
}

function updateState (element) {
  var token = player();
  return $(element).text(token);
}

function setMessage (string) {
  return $("#message").text(string);
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  WIN_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}

function doTurn(element) {
  updateState(element);
  window.turn ++;
  var newState = checkWinner();
    if (newState === true) {
      saveGame();
      resetBoard();
    }
    else if (window.turn === 9) {
      saveGame();
      setMessage("Tie game.");
      resetBoard();
    }
}

function resetBoard () {
  window.turn = 0
  $('td').empty()
  currentGame = 0;
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

function saveGame() {
  var state = [];
  var gameState;

  $('td').text((index, square) => {
    state.push(square);
  });
  gameState = {state: state};

  if (currentGame) {
  $.ajax({
    type: 'PATCH',
    url: `/games/${currentGame}`,
    data: gameState
  });
} else {
  $.post('/games', gameState, function(game) {
    currentGame = game.data.id;
    $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
    $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
  });
  }
}

function showPreviousGames() {
  $('#games').empty();
  $.get('/games', (previousGames) => {
    if (previousGames.data.length > 0) {
      previousGames.data.forEach(buttonizePreviousGame);
    }
  });
}

function buttonizePreviousGame (game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}

function reloadGame(gameID) {
  document.getElementById('message').innerHTML = '';

  const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/games/${gameID}`, true);
  xhr.onload = () => {
    const data = JSON.parse(xhr.responseText).data;
    const id = data.id;
    const state = data.attributes.state;

    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }

    window.turn = state.join('').length;
    currentGame = id;

    if (!checkWinner() && window.turn === 9) {
      setMessage('Tie game.');
    }
  };

  xhr.send(null);
}

    