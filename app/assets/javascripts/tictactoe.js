// Code your JavaScript / jQuery solution here
let turn = 0
let currentGame = () => turn > 0 ? true : false
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
$(document).ready(function() {
  attachListeners()
})

function player() {
  if (turn % 2 === 0) {
    return 'X';
  }  else {
    return 'O';
  }
}

function updateState(square) {
  let token = player()
  $(square).text(token)
}

function setMessage(string) {
  $("#message").text(string)
}

function checkWinner() {
  let winner = false
  let board = []
  $('td').text((i, square) => board.push(square))
  WINNING_COMBOS.forEach(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[1]]} Won!`)
      return winner = true
    }
  })
  return winner
}

function doTurn(square) {
  updateState(square)
  turn++
  if (checkWinner()) {
    resetBoard()
  }
  else if (turn === 9) {
    setMessage('Tie Game.')
    resetBoard()
  }
}

function resetBoard() {
  $('td').empty()
  turn = 0
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this)) {
      doTurn(this)
    }
  })
}
