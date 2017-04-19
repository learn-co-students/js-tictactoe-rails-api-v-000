$(document).ready(function() {
  attachListeners()
})

var turn = 0;
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
  turn += 1
}

var player = () => {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

var updateState = (e) => {
  var target = e.target
  var targetXValue = target.getAttribute("data-x")
  var targetYValue = target.getAttribute("data-y")
  var targetSelector = $(`td[data-x=${targetXValue}][data-y=${targetYValue}]`)
  if ($(targetSelector).text() === "") {
    $(targetSelector).text(player())
  } else {
    alert("That spot is already taken.")
  }
}


var checkWinner = () => {
  for(var i = 0; i < winningCombinations.length; i++) {
    var winCombo = winningCombinations[i]
      for(var j = 0; j < winCombo.length; j++) {
        var currentPlayer = player()
        if($(winCombo[j].selector).text() === currentPlayer && $(winCombo[j+1].selector).text() === currentPlayer && $(winCombo[j+2].selector).text() === currentPlayer) {
          var gratz = `Player ${currentPlayer} won!`
          message(gratz)
        }
      }
  }
}

var message = (string) => {
  $("#message").text(string)
}
