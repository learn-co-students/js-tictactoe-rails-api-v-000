// Code your JavaScript / jQuery solution here


var turn = 0
var won
var tied
var id

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

function tieGame() {
  if (!getBoard().includes("")) {
    return true
  } else {
    return false
  }
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
    saveGame()

    // *** Maybe here is where I put the resetGame() ***

    // won = true

    //CAN'T HAVE THESE HERE OR GAMEPLAY TEST WON'T PASS
    // turn = 0
    // resetBoard()


  }
  else if (!board.includes("")) {
    setMessage(`Tie game.`)
    saveGame()
    // tied = true
  }
  // return true or false whether there is a winner, per test
  return winCombinations.some(winningCondition)
}

function doTurn(square) {

  var board = getBoard()

      // ...and if the square is empty...

  if ((won !== true) || (tied !== true) ) {
    if (square.innerText === "") {

        // ...insert the token.
      updateState(square)
        // If the game is not won after the turn...
    }


  // var isThereAWinner = checkWinner()
  // if ((isThereAWinner === true) || (tieGame() === true)) {
  //   resetBoard()
  //   turn = 0
  //   // removeListenters()
  // }

    var isThereAWinner = checkWinner()
    if (isThereAWinner === true) {
      resetBoard()
      turn = 0
    // removeListenters()
    }
  }
}

function saveGame(){
  var board = getBoard()
  var boardString = JSON.stringify(board)
  if (!id) {
    var posting = $.post("/games", boardString)
    posting.done(function(data) {
      id = data["data"]["id"]
    })
  } else {
    $.ajax({
      url: "/games/" + id,
      method: "PATCH",
      data: boardString
    })

  }
  // if there is no id, create a new game.
  // if there is an id, use it to update the game
  // may need to use the data pass through to save the game
}

//
// function removeListenters() {
//   $("td").off()
// }

function attachListeners() {
  $("td").on("click", function() {
    doTurn(this)
  })

  $("#previous").on("click", function() {
    $.get("/games"), function(data) {
      console.log(data)
    }
  })

  $("#save").on("click", function() {
    saveGame()
    }
    // alert("you clicked save")
  )


  function restartGame() {
    resetBoard()
    id = undefined
    turn = 0
    won = undefined
    tied = undefined
  }

  $("#clear").on("click", function() {
      // I can clean this up
    // if (!id) {
    //   resetBoard()
    // } else {
    //   resetBoard()
    //   id = undefined
    // }

    // alert("clicked clear")
    // $.get("/games"), function(data) {
    //   console.log(data)

    restartGame ()
    }
  )

}


$(document).ready(
  attachListeners()
)
