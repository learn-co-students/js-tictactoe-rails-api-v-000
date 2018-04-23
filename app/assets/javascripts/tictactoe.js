// Code your JavaScript / jQuery solution here


var turn = 0

  // winCombinations are the spots on the board that all must be filled with
  // Xs or Os to win the game
const winCombinations = [[0,4,8], [6,4,2], [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8]]

function getBoard() {
  let boardArray
  boardArray = []

  // Grab all the squares and create the board array with Xs, Os, or ""
  $("td").each( function() {
    boardArray.push(this.innerText)
    })

  return boardArray
}

function resetBoard() {
  $("td").each(function() {
    this.innerText = ""
    })
}

function gameOver() {
  return (checkWinner() === true || !getBoard().includes(""))
}

function player() {
  if (isNaN(turn) || turn % 2 === 0) {
    return "X"
  }
  else {
    return "O"
  }
}

function updateState(element) {
  let token
  token = player()
  $(element).append(token)
  turn += 1
}

function setMessage(string) {
  $("#message").text(string)
}

function checkWinner() {
  var board = getBoard()

  // This is the callback other functions use to check or identify whether
  // one of the winningCombinations is on the board.
  // "Subarray" means one of the nested arrays within winCombinations.
  function winningCondition(subArray) {
    return (board[subArray[0]] !== "") &&
    (board[subArray[0]] === board[subArray[1]]) &&
    (board[subArray[0]] === board[subArray[2]])
  }

  // If one of the winning combinations has been achieved by the Xs
  // and Os on the board...
  if (winCombinations.some(winningCondition)) {
    let winningCombination
    let winningToken

    // ...then find the subarray in winCombinations that is the current winner...
    winningCombination = winCombinations.find(winningCondition)

    // ...to identify the token that has won.
    winningToken = board[winningCombination[0]]
    // debugger

    // Then set the token in a message saying it's the winner.
    setMessage(`Player ${winningToken} Won!`)

    //CAN'T HAVE THESE HERE OR GAMEPLAY TEST WON'T PASS
    // turn = 0
    // resetBoard()


  }
  // return true or false whether there is a winner, per test
  return winCombinations.some(winningCondition)
}

function doTurn(square) {

  checkWinner()

    // If the game is not over...
  if (!gameOver()) {
    // ...remove any prior message, like to select another square
    setMessage("")
    var board = getBoard()
      // ...and if the square is empty...
    if (square.innerText === "") {

      // ...insert the token.
      updateState(square)
      // If the game is not won after the turn...
      if (!checkWinner()) {
      // ..and all the squares are filled, then it is a tie game.
        if (!board.includes("")) {
          setMessage(`Tie game.`)
        }
      // Else, if the game is won, then run checkWinner(), causing
      // victory messages to appear.
    } else if (checkWinner()) {
        checkWinner()
        resetBoard()
        token = 0
      }
    }
      // If the game is not over but square is not empty, then player must
      // select another square.
      else {
        // debugger
        setMessage("Please select another square.")
      }
  }
}


function attachListeners() {
  $("td").on("click", function() {
    doTurn(this)
  })
}


$(document).ready(
  attachListeners()
)
