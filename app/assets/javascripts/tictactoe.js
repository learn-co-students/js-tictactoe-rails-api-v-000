// Code your JavaScript / jQuery solution here
//
// let turn ?? can't define turn or player() won't pass
// turn = 0

var turn = 0

// winCombinations are the spots on the board that all must be filled with
// Xs or Os to win the game
const winCombinations = [[0,4,8], [6,4,2], [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8]]

function player() {
  // debugger
  if (isNaN(turn) || turn % 2 === 0) {
    return "X"
  }
  else {
    return "O"
  }
}

function updateState(element) {
  // debugger
  let token
  token = player()
  $(element).append(token)
}

function setMessage(string) {
  $("#message").text(string)
  // debugger
}

function checkWinner() {
  // board will be an array of the Xs and Os on the board
  let board
  board = []

  // Grab all the squares and create the board array with Xs, Os, or ""
  $("td").each( function() {
    board.push(this.innerText)
    })

  // This is the callback other functions use to check or identify whether
  // one of the winningCombinations is on the board.
  // "Subarray" means one of the nested arrays within winCombinations.
  function winningCondition(subArray) {
    return (board[subArray[0]] !== "") &&
    (board[subArray[0]] === board[subArray[1]]) &&
    (board[subArray[0]] === board[subArray[2]])
  }

  if (winCombinations.some(winningCondition)) {
    let winningCombination
    let winningToken

    // Find the subarray in winCombinations that is the current winner
    winningCombination = winCombinations.find(winningCondition)

    // Identify the token that has won.
    winningToken = board[winningCombination[0]]
    // debugger

    // call setMessage() per tests
    setMessage(`Player ${winningToken} Won!`)
  }

  // return true or false whether there is a winner, per test
  return winCombinations.some(winningCondition)
}

  // return winCombinations.some(function (subArray) {
  //   return (board[subArray[0]] !== "") &&
  //     (board[subArray[0]] === board[subArray[1]]) &&
  //     (board[subArray[0]] === board[subArray[2]])
  // /// change this to an "each" iterator and add if statements
  // })
// }

function doTurn() {
  turn += 1
  if (checkWinner) {
    console.log("winner checked!")
  }
}
