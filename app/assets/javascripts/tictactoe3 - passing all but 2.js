// Code your JavaScript / jQuery solution here


var turn = 0
var won
var tied
var id
var gameOver

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
    gameOver = true

    // *** Maybe here is where I put the resetGame() ***

    // won = true

    //CAN'T HAVE THESE HERE OR GAMEPLAY TEST WON'T PASS
    // turn = 0
    // resetBoard()


  }
  else if (!board.includes("")) {
    setMessage(`Tie game.`)
    saveGame()
    gameOver = true
    // tied = true
  }
  // return true or false whether there is a winner, per test
  return winCombinations.some(winningCondition)
}

function doTurn(square) {

  // if (gameOver !== true) {
    var board = getBoard()

    // if ((won !== true) || (tied !== true) ) {
      if (square.innerText === "") {
        updateState(square)
      }

      var isThereAWinner = checkWinner()
      if (isThereAWinner === true) {
        resetBoard()
        turn = 0
      }
    // }
  // }
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

function restartGame() {
  resetBoard()
  id = undefined
  turn = 0
  won = undefined
  tied = undefined
  gameOver = false
}

function countTurns(array) {
  var count = 0
  for (var i = 0; i < array.length; i++) {
    if (array[i] === "X" || array[i] === "O") {
      count++
    }
  }
  return count
}

function loadGame(gameToLoad) {
  $.ajax({
    url: "/games/" + gameToLoad.dataset.id,
    method: "GET"
  }).done(function(data) {
    var boardToInsert = data["data"]["attributes"]["state"]
    // document.getElementsByTagName("td")
    // var boardToFill = getBoard()
    var boardToFill = $("td")
    id = data["data"]["id"]
    for (let i=0; i<9; i++) {
      boardToFill[i].innerText = boardToInsert[i]
    }

    currentBoard = getBoard()
    turn = countTurns(currentBoard)
    gameOver = false

  })
}

function attachListeners() {
  $("td").on("click", function() {
    doTurn(this)
  })

  $("#previous").on("click", function() {
      // To clear any previous buttons to make sure prior buttons are not re-loaded per test:
    $("#games").empty()

    $.ajax({
      url: "/games",
      method: "GET"
    }).done(function(data) {
      // debugger
    //  console.log(data)
      data["data"].forEach( function (hash) {
        $("#games").append("<button id='game-" + hash["id"] + "' onclick='loadGame(this)' data-id='" + hash["id"] + "'>Game" + hash["id"] + "</button>")
          // "<strong>This is in bold for each array!</strong>")})
        })
    })
  })
    // This Works:
    // $("#games").empty()
    // This works:
    // $("#games").append("<strong> Sup! </strong>")

    // This works:
    // data["data"].forEach( function (arr) {
    //   $("#games").append("<strong>This is in bold for each array!</strong>")})

    // alert("you clicked previous")

    // parenthesis after games" might be misplaced
    // $.get("/games"), function(data) {
    //   debugger


  $("#save").on("click", function() {
    saveGame()
    }
    // alert("you clicked save")
  )

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
