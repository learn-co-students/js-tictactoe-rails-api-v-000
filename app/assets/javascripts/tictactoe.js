// turn and squares are set in tests but not real world application?
function player() {
  if (isNaN(turn) || turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(square) {
  square.innerHTML = player()
}

function setMessage(string) {
  $('#message').html(string)
}

function checkWinner() {
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  const allTds = Array.from(squares)
  const allTdValues = allTds.map(element => element.innerHTML)

  var boolean = winCombinations.some(function(winCombination) {
      const winIndex1 = winCombination[0]
      const winIndex2 = winCombination[1]
      const winIndex3 = winCombination[2]

      const position1 = allTdValues[winIndex1]
      const position2 = allTdValues[winIndex2]
      const position3 = allTdValues[winIndex3]

      if(position1 === "X" && position2 === "X" && position3 === "X") {
        setMessage("Player X Won!")
        return true
      } else if (position1 === "O" && position2 === "O" && position3 === "O") {
        setMessage("Player O Won!")
        return true
      } else {
        return false
      }
    })
    
  return boolean
}
