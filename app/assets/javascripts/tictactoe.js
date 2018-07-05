var emptyBoard = ["", "", "", "", "", "", "", "", ""];

var winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

var gameId;
var turn = 0;

// EVENT LISTENERS

$(document).ready(attachListeners);

function attachListeners() {
  $('button#clear').on('click', clearGame);
  $('button#save').on('click', saveGame);
  $('button#previous').on('click', prevGame);
  $('td').on('click', doTurn);
}

// GAME PLAY

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(square) {
  var currentPlayer = player();
  $(square).text(currentPlayer);
}

function setMessage(str) {
  $('div#message').text(str);
}

function checkWinner() {
  var winner = false;
  var board = {};
  $('td').text((index, square) => board[index] = square);

  winCombos.forEach(position => {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] != "") {
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  });
  if (turn >= 8) {
    setMessage('Tie game.')
  }
  return winner;
}

function doTurn(event) {
  updateState(event.target);
  var winner = checkWinner();
  turn++;
  if (winner === true) {
    clearGame();
  }
}

// BUTTONS

function clearGame() {
  $('td').text("");
  gameId = null;
  turn = 0;
}

function saveGame() {
  var gameState = {
      state: getCurrentBoard()
    }

  if (!!gameId) {
    $.ajax('/games/'+ gameId, {
      type: "PATCH",
      data: JSON.stringify(gameState),
      contentType: 'application/json',
    })
    } else {
      $.post('/games', gameState).done(function(response) {
        gameId = response.data.id;
        console.log('game ' + gameId + ' saved')
      })
    }
}

function prevGame() {
  // build this out
}

function getCurrentBoard() {
  var gameBoard = emptyBoard;
  var gameCells = $('td');
  for (var i = 0; i < gameCells.length; i++) {
    gameBoard[i] = gameCells[i]["innerText"];
  }
  return gameBoard;
}
