// let turn = 0;
var origBoard;
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


// need to build a function that adds count to turn after every move in order for this to work
function player() {
    if (turn % 2 === 0) {
      return "X"
    } else {
      return "O"
    }
  }

function updateState(square) {
    square.innerHTML = player()
}

function setMessage(string) {
    $('#message').text(string)
}

function checkWinner() {
    let winner = false
    boardValues = Array.from($('td')).map(e => e.innerHTML)
    winCombinations.some(winCombo => { 
        debugger
        if (boardValues[winCombo[0]] !== "" && boardValues[winCombo[0]] === boardValues[winCombo[1]] && boardValues[winCombo[1]] === boardValues[winCombo[2]] ) {
            setMessage("Player " + boardValues[winCombo[0]] + " Won!")
            return winner = true
        }
    })
    return winner
}
