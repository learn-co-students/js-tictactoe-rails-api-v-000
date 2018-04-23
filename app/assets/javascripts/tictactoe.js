// Code your JavaScript / jQuery solution here


// Note: "let turn" would not work.  The player() tests won't pass unless
// I use "var turn"

var turn = 0

// winCombinations are the spots on the board that all must be filled with
// Xs or Os to win the game
const winCombinations = [[0,4,8], [6,4,2], [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8]]

function getBoardArray() {
  let boardArray
  boardArray = []

  // Grab all the squares and create the board array with Xs, Os, or ""
  $("td").each( function() {
    boardArray.push(this.innerText)
    })

  return boardArray
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
}

function setMessage(string) {
  $("#message").text(string)
}

function checkWinner() {
  // board will be an array of the Xs and Os on the board
  let board = getBoardArray()

  // Grab all the squares and create the board array with Xs, Os, or ""
  // $("td").each( function() {
  //   board.push(this.innerText)
  //   })
  // debugger
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

function doTurn(square) {
  turn += 1
  updateState(square)
  if (!checkWinner()) {
    // debugger
    if (!board.includes("")) {
      console.log("Tie!")
      setMessage(`Tie game.`)
    }
  }
  else {
    checkWinner()
    turn = 0


  }
  // if (checkWinner()) {
  //   // do I need to add return -- how do I end the execution of the rest of the code?
  //   checkWinner()
  // }
  // else {
  //   let board = getBoardArray()
  //   if (!(board.includes(""))) {
  //     console.log("tie!")
  //   }
  // }

}


function attachListeners() {
  $("td").on("click", function() {
    doTurn(this)
    // updateState(this)
    // debugger
    // console.log("you clicked it")
  })
}

// $( "p" ).on( "click", function() {
//   alert( $( this ).text() );
// });

$(document).ready(
    attachListeners()
)
