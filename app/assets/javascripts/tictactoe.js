// Code your JavaScript / jQuery solution here
const WIN_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];


var turn = 0;
var currentGame = 0;


$(document).ready(function() {
  attachListeners();
});

function player() {
  return (turn % 2 ? 'O' : 'X');
}

function updateState(square) {
  $(square).text(player())
}

function setMessage(string) {
  $('#message').text(string);
}

function checkWinner() {
  var board = {};
  var winner = false;
  $('td').text((index, square) => board[index] = square);

  WIN_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[0]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`)
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
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.")
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
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#previous').on('click', () => previousGames());
  $('#save').on('click', () => saveGame());
  $('#clear').on('click', () => resetBoard());
}

function previousGames() {
  $('#games').empty();
  $.get('/games', (prevGames) => {
    if (prevGames.data.length) {
      prevGames.data.forEach(makeButton)
    }
  });
}

function makeButton(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`)
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}

function saveGame() {
  var state = [];
  var squareData;

  $('td').text((index, square) => {
    state.push(square);
  });
  squareData = {state: state};

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: squareData
    });
  } else {
    $.post('/games', squareData, function(game) {
      currentGame = game.data.id;
      makeButton(currentGame)
    });
  }
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
