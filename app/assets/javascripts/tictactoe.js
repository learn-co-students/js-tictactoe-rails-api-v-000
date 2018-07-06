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
  $('div#games').on('click', function(event) {
    loadGame(event.target);
  });
  $('td').on('click', function(event) {
    if (!event.target.innerHTML && !checkWinner()) {
      doTurn(event.target);
    }
  });
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
      setMessage(`Player ${board[position[0]]} Won!`);
      winner = true;
      return winner;
    }
  });
  return winner;
}

function checkTie() {
  if (turn > 8 && checkWinner() === false) {
    setMessage('Tie game.')
    return true;
  }
}

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    clearGame();
  }
}

// BUTTONS

function clearGame() {
  $('td').empty();
  gameId = null;
  turn = 0;
}

function saveGame() {
  var gameState = {
      state: getCurrentBoard()
    }

  if (!!gameId) {
    $.ajax({
      method: "PATCH",
      url: `/games/${gameId}`,
      data: JSON.stringify(gameState),
      contentType: 'application/json',
    })
  } else {
    $.ajax({
      method: 'POST',
      url: '/games',
      data: gameState,
      contentType: 'application/json'
    }).done(function(response) {
      gameId = response.data.id;
      console.log('game ' + gameId + ' saved')
    })
  }
}

function prevGame() {
  $.ajax({
    method: 'GET',
    url: '/games',
    contentType: 'application/json'
  }).done(function(response) {
    var prevGames = response.data;
    var buttonHTML = '';
    prevGames.forEach(game => {
      buttonHTML += `<button class="loadGame" data-id="${game.id}">Load Game ${game.id}</button><br />`;
    })
    $('#games').html(buttonHTML);
  })
}

function loadGame(button) {
  clearGame();
  var id = button.dataset.id;
  $.ajax({
    method: 'GET',
    url: `/games/${id}`,
    contentType: 'application/json'
  }).done(function(response) {
    var gameState = response.data.attributes.state;
    var squares = $('td')
    for (var i = 0; i < 9; i++) {
      $(squares[i]).text(gameState[i]);
    }
    gameId = id;
    var board = getCurrentBoard();
    turn = gameState.join('').length
    //turn = board.filter(space => space).length;
  })
}

function getCurrentBoard() {
  var gameBoard = emptyBoard;
  var gameCells = $('td');
  for (var i = 0; i < gameCells.length; i++) {
    gameBoard[i] = gameCells[i]["innerText"];
  }
  return gameBoard;
}
