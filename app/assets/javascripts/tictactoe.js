// Code your JavaScript / jQuery solution here

var WIN_COMBO = [
  [0,1,2],[3,4,5],[6,7,8], // horizontal rows
  [0,3,6],[1,4,7],[2,5,8], // vertical rows
  [0,4,8],[2,4,6] // diagonals
];

var turn = 0;
var currentGame = 0;

$(document).ready(function() {
  attachListeners();
});

function player() {
  return turn % 2 ? 'O' : 'X';
}

function updateState(position) {
  let token = player();
  $(position).text(token);
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  let board = [];
  let winner = false;

  $('td').text((index, square) => board[index] = square);

  WIN_COMBO.forEach(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });
  return winner;
}

function doTurn(position) {
  updateState(position);
  turn ++;
  if (checkWinner()) {
    saveGame();
    clearBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
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
  $('#previous').on('click', () => previousGame());
  $('#clear').on('click', () => clearBoard());
}

function clearBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}


function saveGame() {
  var state = [];
  var gameData;

  $('td').text((index, square) => {
    state.push(square);
  });

  gameData = { state: state };

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}

function previousGame() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(previousButton);
    }
  });
}

function previousButton(game) {
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

    turn = state.join('').length;
    currentGame = id;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  };

  xhr.send(null);
}
