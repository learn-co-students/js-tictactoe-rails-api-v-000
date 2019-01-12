// Code your JavaScript / jQuery solution here

var turn = 0
var currentGame = 0

WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

$(document).ready(function() {
  attachListeners()
})

function player() {
  return turn % 2 === 0 ? "X":"O"
}

function updateState(square) {
  $(square).text(player())
}

function setMessage(message) {
  $("#message").text(message)
}

function checkWinner() {
  var winner = false;
  var board = {}

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.forEach(function(position) {
   if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "" ) {
     setMessage(`Player ${board[position[0]]} Won!`)
     winner = true;
   }
  })
  return winner;
 }


function doTurn(square) {
  updateState(square)
  turn++
  if (checkWinner()) {
   $('td').empty()
   turn = 0
  } else if (turn === 9) {
   setMessage("Tie game.")
  }
}

function attachListeners() {
  $('td').on('click', function() {              //attach listener on click of a square in 'td'
    if(!$.text(this) && !checkWinner()) {     //if there is no text in this square & we don't have a winner
    //console.log(this)
      doTurn(this)                              //call the turn function
    }
  })
  $('#clear').on('click', () => resetGame());
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => previousGames());
}

function resetGame() {
  $('td').empty()
  turn = 0
  setMessage('')
}

function saveGame() {
  //saves current game state
  //if already exists in db, update the game state  *possibly using PATCH
  //if not, will save to db          *possibly using POST
  //have a div w/id = 'games'
}

function previousGames() {

}
