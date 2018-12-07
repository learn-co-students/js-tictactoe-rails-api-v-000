// Code your JavaScript / jQuery solution here
var turn = 0
var win_combinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

$( document ).ready( attachListeners )

var player = () => turn % 2 === 0 ? "X" : "O"


function doTurn(td) {
  // console.log(`start turn #: ${turn}`)
  updateState(td)
  turn ++
  if (checkWinner()) {
    resetBoard()
  } else if (turn === 9) {
    setMessage("Tie game.")
    resetBoard()
    }
  }


function updateState(td) {
  console.log(`current turn #: ${turn}`)
      $(td).text(player())
      debugger
}

function setMessage(string) {
  $("#message").text(string)
}

function checkWinner() {
  var board = []
  var winner = false
  $("td").text(function(index, token){ board[index] = token})

  win_combinations.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
     setMessage(`Player ${board[combo[0]]} Won!`);
     return winner = true;
    }
  })
  return winner
}

function resetBoard() {
  $('td').empty()
  turn = 0
}

function attachListeners() {
  $("td").on('click', function() {
    doTurn(this)
  })
}
