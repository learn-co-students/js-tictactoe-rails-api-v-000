// Code your JavaScript / jQuery solution here
$(function() {
  attachListeners();
})

var currentGame = 0;
var turn = 0;
const winningCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

function attachListeners(){
  $('td').on('click', function(){
    if (!checkWinner() && !$.text(this)) {
      doTurn(this);
    }
  })
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => previousGame());
  $('#clear').on('click', () => clearGame());
}

function saveGame() {
    var state = [];
    $('td').text((index, content) => {
      state.push(content);
    })
    var gameState = { state: state };

    if (currentGame) {
      $.ajax ({
        url: `/games/${currentGame}`,
        type: 'PATCH',
        data: gameState,
        success: function(data) {
          
        }
      })
    } else {
      $.post('/games', gameState, function(game) {
        var gameId = game["data"].id
        currentGame = gameId;
        $('#games').append(`<button id="game-${gameId}" data-id="${gameId}">Game #${gameId}</button>`)
        $(`#game-${gameId}`).on('click', () => reloadGame(gameId));
        if (checkWinner() || turn === 9) {
          clearGame();
        }
      });
    }
}
    

function previousGame() {
  $.get('/games', function(games) {
    games["data"].forEach (function(game) {
      if (!($('#games').text().includes(`Game #${game.id}`))) {
        $('#games').append(`<button id="game-${game.id}" data-id="${game.id}">Game #${game.id}</button>`)
        $(`#game-${game.id}`).on('click', () => reloadGame(game.id));
      }
    })
  })
}

function reloadGame(gameId) {
  $.get(`/games/${gameId}`, function(response) {
    var gameState = response["data"]["attributes"]["state"];
    currentGame = response["data"]["id"];
    $('td').text((index, content) => {
      $('td')[index].innerHTML = gameState[index];
      gameState[index] !== "" ? turn++ :  turn;
    })
  })
}

function clearGame() {
  currentGame = 0;
  turn = 0;
  $('td').text((index, content) => {
    $('td')[index].innerHTML = "";
  })
}

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(square) {
  square.innerHTML = player();
}

function setMessage(message) {
  $('#message')[0].innerHTML = `<p><strong>${message}</strong></p>`
}

function checkWinner() {
  var board = {}
  var winner = false
  $('td').text((index, value) => board[index] = value)
  winningCombos.some(function(combo){
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
    }
  })
  return winner;
}

function doTurn(square) {
  updateState(square);
  turn++
  if (checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn === 9) {
    setMessage('Tie game.')
    saveGame();
    clearGame();
  }
}