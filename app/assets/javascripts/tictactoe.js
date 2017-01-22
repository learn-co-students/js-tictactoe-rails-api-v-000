var turn = 0
var winningCombos = [
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  [[0,0],[1,1],[2,2]],
  [[0,0],[0,1],[0,2]],
  [[2,0],[2,1],[2,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[1,1],[0,2]]
]

function attachListeners() {
  $('td').on('click', function(event) {
    if (event.target.innerHTML === "") {
      doTurn(event)
    }
  })
}

function doTurn(event) {
  updateState(event)
  turn ++
  checkWinner()
}

function checkWinner() {

}

function updateState(event) {
  event.target.innerHTML = player()
}

function player() {
  return turn % 2 === 0 ?  "X" :  "O"
}

function message(message) {
  $('#message').html(message)
}

function checkWon(combo) {
  if ($('td[data-x="' + combo[0][0] + '"][data-y="' + combo[0][1] + '"]').html() === $('td[data-x="' + combo[1][0] + '"][data-y="' + combo[1][1] + '"]').html() && $('td[data-x="' + combo[2][0] + '"][data-y="' + combo[2][1] + '"]').html() === $('td[data-x="' + combo[1][0] + '"][data-y="' + combo[1][1] + '"]').html() && $('td[data-x="' + combo[0][0] + '"][data-y="' + combo[0][1] + '"]').html() !== "") {
    return true
  }
}

function checkFull() {
  var full = true
  $('td').each(function() {
    if (this.innerHTML === "") {
      full = false
    }
  })
  return full
}

function resetGame() {
  $('td').each(function() {
    this.innerHTML = ""
  })
  turn = 0
}

function checkWinner() {
  for (var i = 0; i < winningCombos.length; i++) {
    var combo = winningCombos[i]
    if (checkWon(combo)) {
      var winningToken = $('td[data-x="' + combo[0][0] + '"][data-y="' + combo[0][1] + '"]').html()
      message("Player " + winningToken + " Won!")
      resetGame()
    }
  }
  if (checkFull() === true) {
    message("Tie game")
    resetGame()
  }
  return false
}

$(document).ready(function() {
  attachListeners()
})
