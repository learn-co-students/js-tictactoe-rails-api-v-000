// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;
var board = {};
var winningCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function player () {
  if (turn % 2 === 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState (token) {
  if (player() === 'X') {
    $(token).html('X')
  } else {
    $(token).html('O')
  }
}

function setMessage (message) {
  $('#message').text(message)
}

function checkWinner () {
  var winner = false
  $('td').text((index, td) => board[index] = td)

  winningCombos.some ((combo) => {
    if (board[combo[0]] !== '' && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      winner = true
      setMessage (`Player ${board[combo[0]]} Won!`)
    }
  })
  return winner
}

function doTurn (token) {
  updateState (token)
  ++turn
  if (checkWinner () === true) {
  } else if (turn === 9 && checkWinner() === false) {
    setMessage("Tie game.")
  }
}

function attachListeners () {
  $('td').on('click', function () {
    if (!$.text(this) && !checkWinner ()) {
      doTurn (this)
    }
  })
  $('#save').on('click', () => saveGame ())
  $('#previous').on('click', () => previousGames ())
  $('#clear').on('click', () => resetBoard ())
}
