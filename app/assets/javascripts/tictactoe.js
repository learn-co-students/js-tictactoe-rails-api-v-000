// Game play functions //
var turn = 0
var winningCombos = [
  [0, 1, 2], [4, 3, 5], [6, 7, 8],
  [0, 4, 6], [1, 3, 7], [2, 5, 8],
  [0, 5, 8], [3, 5, 6]
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

function setMessage() {

}

function checkWinner() {
  var board = {};
  var winner = false
  // .text(function): fx return text content to set (for each element)
  // Receives the index position of the element in the set and the old text value as arguments.
  $('td').text(function(index, token){
    board[index] = token
  })
}

function doTurn(element) {
  // Increments the turn variable by 1
  ++turn

  updateState(element)

  checkWinner()
}

// Listeners //

$(function attachListeners() {
  // Attaches the appropriate event listeners to:
  $('td').on('click', function() {
    // If no text & no winner
    if (!$.text(this) && !checkWinner()) {
      // Make a play
      doTurn(this)
    }
  })

  $('#save').on('click', () => saveGame())
  $('#previous').on('click', () => showPreviousGames())
  $('#clear').on('click', () => resetBoard())
})
