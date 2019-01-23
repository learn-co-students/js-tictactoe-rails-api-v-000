// Game play functions //
var turn = 0
var currentGame = 0
const WINNINGCOMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
]

$(document).ready(function() {
  attachListeners()
})


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

function doTurn(cell) {
  // Increments the turn variable by 1
  turn++

  updateState(cell)

  if (turn === 9) {
    setMessage("Tie game.")
    saveGame()
    resetBoard()
  } else if (checkWinner()) {
    saveGame()
    resetBoard()
  }
  // if (turn === 9) {
  //   setMessage("Tie game.")
  //   turn = 0
  //   saveGame()
  //   $("td").empty()
  // } else if (checkWinner() === true) {
  //   saveGame()
  //   turn = 0
  //   $("td").empty()
  // }
}

// Listeners & Buttons //

function saveGame() {
  var gameData
  var state = []

  $('td').text(function(index, token){
    state[index] = token
  })

  gameData = { state: state }

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    })
    alert(`Game ${currentGame} Updated`)
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id
      alert(`Game ${currentGame} Saved`)
    })
  }
}

function reloadGame(gameID) {
  $.get(`/games/${gameID}`, function(game) {
    currentGame = game["data"]["id"]
    var state = (game["data"]["attributes"]["state"])
    // ["", "", "X", "O", "O", "", "", "", ""]
    // use the index from the html table cells to load the value of the state index
    $('td').text(function(index) {
      // Error: append adds, so if already an "X", cell turns into "XX" or "XO"
      // $(this).append(state[index])
      $(this)[0].innerText = state[index]
    })
    for(var i = 0; i < state.length; ++i){
      if(state[i] != "")
        ++turn
    }
  })
}

function showPreviousGames() {
  $('#games').empty()
  // if there are saved games
  $.get('/games', (savedGames) => {
    var games = savedGames["data"]
      games.forEach(function(game) {
        $('#games').append(`<button id=gameid-${game["id"]}> Game: ${game["id"]} </button><br>`)
        $('#gameid-' + game["id"]).on('click', () => reloadGame(game["id"]))
      })
  })
}

function resetBoard() {
  $('td').empty()
  turn = 0
  currentGame = 0
  $("div#message").empty()
}

function attachListeners() {
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
}
