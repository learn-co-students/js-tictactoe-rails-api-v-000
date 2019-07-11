var turn = 0;
var currentGame = 0;

const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
  [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var player = () => turn % 2 ? 'O' : 'X';


$(document).ready(function() {
  attachListeners();
});


function doTurn(td) {
  updateState(td);
  turn++;
  if (checkWinner()) {
    saveGame();
    reset();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    reset();
  }
}

function reset() {
  $('td').empty();
  turn = 0;
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

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });
  return winner;
}

function updateState(square) {
  var token = player();
  $(square).text(token);
}

function setMessage(msg) {
  $("#message").text(msg) 
}

function saveGame() {
  var state = [];
  var gameData;

  $('td').text((square) => {
    state.push(square);
  })

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


function showPreviousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(buttonizePreviousGame);
    }
  });
}