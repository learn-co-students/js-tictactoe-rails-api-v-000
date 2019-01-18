// Game play functions //
var turn = 0

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
  cell.append(player())
}

function setMessage() {

}

function checkWinner() {

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
    debugger
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
