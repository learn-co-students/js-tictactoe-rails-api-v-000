var WIN_COMBOS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]
var EMPTY_BOARD = ["", "", "", "", "", "", "", "", ""];
var gameId;
var turn = 0;

$(document).ready(attachListeners);

function attachListeners() {
  $('td').on('click', function(event) {
    if (!event.target.innerHTML && !checkWinner()) {
      doTurn(event.target);
    }
  });
  $('button#clear').on('click', clearGame);
  $('button#save').on('click', saveGame);
  $('button#previous').on('click', prevGame);
  $('div#games').on('click', function(event) {
    loadGame(event.target);
  });
}

function player() {
  if (turn % 2 === 0) {
    return "X"
  }
  else {
    return "O"
  }
}

function updateState(square) {
  $(square).text(player());
}

function setMessage(str) {
  $('div#message').text(str);
}

function checkWinner() {
  var winner = false;
  var board = {};
  $('td').text((index, square) => board[index] = square);

  WIN_COMBOS.forEach(position => {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] != "") {
      setMessage(`Player ${board[position[0]]} Won!`);
      winner = true;
      return winner;
    }
  });
  return winner;
}

function checkTie() {
  if (turn > 8 && !checkWinner()) {
    setMessage('Tie game.')
    return true;
  }
}

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner() || checkTie()) {
    saveGame();
    clearGame();
  }
}

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
      data: JSON.stringify(gameState),
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
  })
}

function getCurrentBoard() {
  var gameBoard = EMPTY_BOARD;
  var gameCells = $('td');
  for (var i = 0; i < gameCells.length; i++) {
    gameBoard[i] = gameCells[i]["innerText"];
  }
  return gameBoard;
}
