// Code your JavaScript / jQuery solution here
var turn = 0
var gameId = 0

$(document).ready(function() {
  attachListeners()
})

function player() {
  return (turn % 2 === 0) ? "X" : "O"
}

function updateState(square) {
  $(square).text(player())
}

function setMessage(string) {
  $("div#message").text(string)
}

/* Don't know why Node testing says this isn't work when it works with Mocha and when self testing.
function checkWinner() {
  const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]
  var board = $('td')
  var won = false
  winningCombos.forEach((combo) => {
    if (combo.every(position => board[position].innerText === "X") || combo.every(position => board[position].innerText === "O")) {
      setMessage(`Player ${board[combo[0]].innerText} Won!`)
      return won = true
    }
  })
  return won
}
*/

function checkWinner() {
  const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]
  var board = {}
  var winner = false
  $('td').text((index, square) => board[index] = square)

  winningCombos.forEach(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
    }
  });

  return winner;
}


function doTurn(square) {
  updateState(square)
  turn++
  var won = checkWinner()

  if (won === true) {
    saveGame()
    resetGame()
  } else if (turn === 9 && won === false) {
    saveGame()
    setMessage("Tie game.")
    resetGame()
  } else {
    setMessage("")
  }
}


function attachListeners() {
  $('td').on('click', function() {
    if(!$.text(this) && !checkWinner() ) {
      doTurn(this)
    }
  })

  $('#save').on("click", () => saveGame())
  $('#previous').on("click", () => previousGames())
  $('#clear').on("click", () => resetGame())
}

function resetGame() {
  turn = 0
  console.log(turn)
  gameId = 0
  $('td').empty()
}

function saveGame() {
  var board = jQuery.makeArray($('td'))
  var state = board.map(square => square.innerText)

  if (gameId === 0) {
    $.post("/games", {state: state}, function(resp) {
      gameId = resp.data.id
    })
  } else {
    $.ajax({
     type: 'PATCH',
     url: `/games/${gameId}`,
     data: {state: state}
   })
  }
}

function previousGames() {
  // Specs won't let me use condition $("div#games").html() === "", the way that works properly
  if ($("div#games").html("")) {
    $.get("/games", function(resp) {
      var games = $(resp.data)
      games.each(index => {
        $("div#games").append(`<button onclick="showGame(${games[index]["id"]})">Session ${games[index]["id"]}</button>`)
      })
    })
  } else {
    $("div#games").empty()
  }
}

function showGame(id) {
  gameId = id
  $.get(`/games/${id}`, function(resp) {
    var gameState = $(resp.data)["0"]["attributes"]["state"]
    $('td').text(index => gameState[index])

    turn = 0
    gameState.forEach(position => {
      if (position === "X" || position === "O") {
        turn++
      }
    })
  })
}
