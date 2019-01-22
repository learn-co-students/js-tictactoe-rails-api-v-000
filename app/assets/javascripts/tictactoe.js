// Game play functions //
var turn = 0
var currentGame = 0
const WINNINGCOMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
]

function player() {
  // Returns 'X' or 'O' if turn is even or odd
  if (turn%2 === 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(element) {
  var cell = element
  // adds returned string ('X' or 'O') to clicked square on board
  cell.textContent = player()
}

function setMessage(message) {
  $("div#message").append(message)
}

function checkWinner() {
  var board = {}
  var winner = false
  // .text(function): fx return text content to set (for each element)
  // Receives the index position of the element in the set and the old text value as arguments.
  $('td').text(function(index, token){
    board[index] = token
  })
  // check board for winning combos
  // .some() tests whether at least one element in the array passes the test implemented by the provided function.
  WINNINGCOMBOS.forEach( function(combo) {
    // combo values define the board's indices to check for winner
    if (board[combo[0]] != "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] === board[combo[2]]) {
      winner = true
      var message = `Player ${board[combo[0]]} Won!`
      setMessage(message)
    }
  })
  return winner
}

function doTurn(element) {
  // Increments the turn variable by 1
  ++turn

  updateState(element)

  if (checkWinner() === true) {
    turn = 0
    $("td").empty()
  } else if (turn === 9) {
    setMessage("Tie game.")
    turn = 0
    $("td").empty()
  }
}

// function reloadGame(gameID) {
//
// }

// Listeners & Buttons //

function saveGame() {
  var gameData
  var state = []

  $('td').text(function(index, token){
    state[index] = token
  })

  gameData = { state: state }

  if (currentGame ) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    })
    alert("Game Updated")
  } else {
    $.post("/games", gameData, function(game) {
      currentGame = game.data.id
      alert("Game Saved")
    })
  }
}

function showPreviousGames() {
  // $('#games').append(`Game - ${game.data.id}`)
  // $('#games').append(`<button id="gameid-${game.data.id}">Game - ${game.data.id}</button><br>`)
  // $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id))
}

function resetBoard() {
  if (currentGame) {
    alert("Clear Game In Progress")
  }
  $("td").empty()
}

$(function attachListeners() {
  // Attaches the appropriate event listeners to:
  $('td').on('click', function() {
    // If no text & no winner
    if (!$.text(this) && !checkWinner() ) {
      // Make a play
      doTurn(this)
    }
  })

  $('#save').on('click', () => saveGame())
  $('#previous').on('click', () => showPreviousGames())
  $('#clear').on('click', () => resetBoard())
})
