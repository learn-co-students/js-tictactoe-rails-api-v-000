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
        restartGame()
        // resetBoard()
        // turn = 0
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

  // Had to look at solution to figure out that this is where
  // you can checkWinner() to pass the second test under gameplay.
  // Unfortunatly, the tests only allow you to call checkWinner()
  // once under doTurn()
  // Theme here if I look back in the future: I had to do a lot, that
  // I might otherwise not do, to accomodate the tests.
function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  })
  // $("td").on("click", function() {
  //   doTurn(this)
  // })

  $("#previous").on("click", function() {
      // To clear any previous buttons to make sure prior buttons are not re-loaded per test:
    $("#games").empty()

    $.ajax({
      url: "/games",
      method: "GET"
    }).done(function(data) {
      data["data"].forEach( function (hash) {
        $("#games").append("<button id='game-" + hash["id"] + "' onclick='loadGame(this)' data-id='" + hash["id"] + "'>Game" + hash["id"] + "</button>")
        })
    })
  })


  $("#save").on("click", function() {
    saveGame()
    }
  )

  $("#clear").on("click", function() {
    restartGame ()
    }
  )

}


$(document).ready(
  attachListeners()
)
