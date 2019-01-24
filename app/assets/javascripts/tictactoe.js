// Code your JavaScript / jQuery solution here
const WIN_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
]

var currentGame = 0;
var turn = 0;

$(document).ready(function() {
  attachListeners();
});

var player = () => turn % 2 === 0 ? 'X':'O';

function attachListeners() {
  document.addEventListener('click', function(event) {
    let target = event.target;

    if (target.id.includes("game-")) {
      loadGame(target.id);
    }
  });

  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => previousGames());
  $('#clear').on('click', () => resetGame());
}


function updateState(square) {
  var currentPlayer = player();

  $(square).text(currentPlayer);
}

function doTurn(square) {
  updateState(square);
  turn += 1;

  if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetGame();
  } else if (checkWinner()) {
    saveGame();
    resetGame();
  }
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  WIN_COMBINATIONS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });
  return winner;
}

function setMessage(string) {
  $('#message').text(string);
}

function resetGame() {
  turn = 0;
  currentGame = 0;
  $('td').empty();
}

function previousGames() {
  $.get("/games", function(data) {
    let games = data.data;
    let string = "";

    for (let i = 0; i < games.length; i++) {
      let id = games[i].id;
      let game = games[i].attributes.state;

      string += `<button id="game-${id}">${id} - ${game}</button>`;
    }
    $("#games").html(string);
  });
}


function saveGame() {
  let state = [];

  $('td').text((index, square) => {
    state.push(square);
  });

  if (currentGame > 0) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: { state: state }
    });
  } else {
    $.post('/games', { state: state }, function(game) {
      currentGame = game.data.id;
    });
  }
}

function loadGame(gameId) {
  let id = parseInt(gameId.split("-")[1]);
  let squares = window.document.querySelectorAll('td');
  currentGame = id;

  $.get('/games/' + id, function(data) {
    let state = data.data.attributes.state;

    for (let i = 0; i < squares.length; i++) {
      squares[i].innerHTML = state[i];
      if (state[i] !== "") {
        turn += 1;
      }
    }
  });
}
