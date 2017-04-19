$(document).ready(function() {
  attachListeners()
})

var turn = 0

const winningCombinations = [
    [$(`td[data-x=0][data-y=0]`), $(`td[data-x=1][data-y=0]`), $(`td[data-x=2][data-y=0]`)],
    [$(`td[data-x=0][data-y=1]`), $(`td[data-x=1][data-y=1]`), $(`td[data-x=2][data-y=1]`)],
    [$(`td[data-x=0][data-y=2]`), $(`td[data-x=1][data-y=2]`), $(`td[data-x=2][data-y=2]`)],
    [$(`td[data-x=0][data-y=0]`), $(`td[data-x=0][data-y=1]`), $(`td[data-x=0][data-y=2]`)],
    [$(`td[data-x=1][data-y=0]`), $(`td[data-x=1][data-y=1]`), $(`td[data-x=1][data-y=2]`)],
    [$(`td[data-x=2][data-y=0]`), $(`td[data-x=2][data-y=1]`), $(`td[data-x=2][data-y=2]`)],
    [$(`td[data-x=0][data-y=0]`), $(`td[data-x=1][data-y=1]`), $(`td[data-x=2][data-y=2]`)],
    [$(`td[data-x=2][data-y=0]`), $(`td[data-x=1][data-y=1]`), $(`td[data-x=0][data-y=2]`)],
]

var attachListeners = () => {
  $("td").on("click", function(e) {
    doTurn(e)
  })
}

var doTurn = (e) => {
  updateState(e)
  checkWinner()
  turn++

}

var player = () => {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

var updateState = (e) => {
  return e.currentTarget.innerText = player()
}


var checkWinner = () => {
  var currentPlayer = player()
  var gameWon = false

  for(var i = 0; i < winningCombinations.length; i++) {
      var winCombo = winningCombinations[i]
      if($(winCombo[0].selector).text() === currentPlayer && $(winCombo[1].selector).text() === currentPlayer && $(winCombo[2].selector).text() === currentPlayer) {
        var gratz = `Player ${currentPlayer} won!`
        message(gratz)
        gameWon = true
        resetGame()
      }
    }
    
  return gameWon
}

var resetGame = () => {
    turn = 0
    $('td').each(function(index, value) {
      value.innerText = ""
    })
}

var message = (string) => {
  $("#message").text(string)
}
