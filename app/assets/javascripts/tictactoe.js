const WIN_COMBINATIONS = [
    [0,1,2], 
    [3,4,5],
    [6,7,8], 
    [0,3,6], 
    [1,4,7], 
    [2,5,8],
    [2,4,6],
    [0,4,8]
]

var currentGame = undefined;
var turn = 0;

function player() {
  return turn % 2 === 0 ? 'X' : 'O';
}

function updateState(square) {
  $(square).text(player());
}

function setMessage(string) {
  $('#message').text(string);
}

function checkWinner() {
  var board = [];
  var winner = false;

  $('td').text(function(index, square) {
    board[index] = square
  });

  WIN_COMBINATIONS.some(function(combo) {
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
    resetGame();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetGame();
  }
}

function resetGame() {
  turn = 0;
  currentGame = undefined;
  $('td').empty();
}

function clearAll() {
  $('#message').empty();
  resetGame();
}


$(document).ready(function() {
  attachListeners()
});

function attachListeners() {
  $('td').on('click', function (){
    if(!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPrevious());
  $('#clear').on('click', () => clearAll());
}

function saveGame() {
  var board = [];
  $('td').text(function(index, square) {
    board.push(square)
  });

 var gameData = {state: board};

 if (currentGame) {
  $.ajax({
    type: 'PATCH', 
    url: `/games/${currentGame}`, 
    data: gameData
  });
 } else {
  $.post('/games', gameData, function(game) {
    currentGame = game.data.id;
    $('#games').append(`<button id="${game.id}">${game.id}</button><br>`);
  });
 }
}

function showPrevious() {
  $('#games').empty();
  $.get('/games', function(gameData) {
    if(gameData.data.length) {
      gameData.data.forEach(function(game) {
        $('#games').append(`<button id="${game.id}">${game.id}</button><br>`);
        $(`#${game.id}`).on('click', () => loadGame(game.id));
      });
    }
  });
}

function loadGame(gameID) {
  $.get(`/games/${gameID}`, function(game){
    let state = game.data.attributes.state
    let id = game.data.id

    let index = 0
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index]
        index++
      }
    }

    turn = state.join('').length;
    currentGame = id;
  });
}

