// Code your JavaScript / jQuery solution here
var turn = 0
let currentGame = 0
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
$(document).ready(function() {
  attachListeners()
})

function player() {
  if (turn % 2 === 0) {
    return 'X';
  }  else {
    return 'O';
  }
}

function updateState(square) {
  let token = player()
  $(square).text(token)
}

function setMessage(string) {
  $("#message").text(string)
}

function checkWinner() {
  let winner = false
  let board = {}
  $('td').text((i, square) => board[i]=square)
  WINNING_COMBOS.forEach(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[1]]} Won!`)
      return winner = true
    }
  })
  return winner
}

function doTurn(square) {
  updateState(square)
  turn++
  if (checkWinner()) {
    saveGame()
    resetBoard()
  }
  else if (turn === 9) {
    setMessage('Tie game.')
    saveGame()
    resetBoard()
  }
}

function resetBoard() {
  $('td').empty()
  turn = 0;
  currentGame = 0;
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  })
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
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

function showPreviousGames() {
  $("#games").empty()
  $.get('/games', function(savedGames) {
    if (savedGames.data.length) {
      savedGames.data.forEach(buttonizePreviousGame)
    }
  })
}

function buttonizePreviousGame(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}

function reloadGame(gameId) {
  $.get('/games/'+gameId, function(resp) {

    const data = resp.data
    const id = data.id;
    const state = data.attributes.state;
    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }
    turn = state.join('').length
    debugger
    currentGame = id;

  })
}
