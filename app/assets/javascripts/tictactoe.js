var turn = 0;
var winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

var currentGame

$(function() {
  attachListeners()
})

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(square) {
  square.innerHTML = player()
}

function setMessage(message) {
  $('div#message').html(message)
}

function checkWinner() {
  let board = $('td').map(function(){
    return $(this).text()
  }).get()
 winCombos.find((win) => {
    if (board[win[0]] === board[win[1]] && board[win[1]] === board[win[2]] && board[win[0]] !== "" && board[win[0]] !== undefined) {
      setMessage(`Player ${board[win[0]]} Won!`)
      return winner = true
    } else {
      return winner = false
    }
  })
  return winner
}

function doTurn(square) {
  updateState(square)
  turn++
  if (checkWinner()) {
    saveGame()
    clearGame()
  } else if (turn === 9) {
      setMessage("Tie game.")
      saveGame()
      clearGame()
  }
}

function attachListeners() {
  $('td').on('click', function() {
    if ($(this).text() === '' && !checkWinner()) {
      doTurn(this)
    }
  })

  $('#save').on('click', () => saveGame())
  $('#previous').on('click', () => showPreviousGames())
  $('#clear').on('click', () => clearGame())
}

function saveGame() {
 let boardState = $('td').map(function(){
     return $(this).text()
  }).get()
  data = {state: boardState}

  if (currentGame) {
    $.ajax({
      type: "PATCH",
      url: `/games/${currentGame}`,
      data: data
    })

  } else {
    $.ajax({
      type: "POST",
      url: '/games',
      data: data,
      success: function(game) {
        currentGame = game.data.id
        $('#games').append(`<button id='gameid-${game.data.id}'>${game.data.id}</button>`)
        $(`#gameid-${game.data.id}`).on('click', () => reloadGame(game.data.id))
      }
    })
  }
}

function showPreviousGames() {
  $('#games').empty()
  $.get('/games', function(games){
    if (games['data'].length > 0) {
      games['data'].forEach(previousGamesButton)
    }
  })
}

function previousGamesButton(game) {
  $('#games').append(`<button id='gameid-${game.id}'>${game.id}</button>`)
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id))
}

function reloadGame(gameId){
  $.get(`/games/${gameId}`, function(game){
    currentGame = game.data.id
    const state = game.data.attributes.state
    turn  = state.filter((e) => e!=='').length
    let index = 0
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++){

        $(`td[data-x='${x}'][data-y='${y}']`).html(state[index])
        index++
      }
    }
  })
}

function clearGame() {
  turn = 0;
  currentGame = undefined;
  $('td').empty();
}
