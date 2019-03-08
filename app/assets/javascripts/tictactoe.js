// Code your JavaScript / jQuery solution here
const winningCombos = [
   [0, 1, 2],
   [3, 4, 5],
   [6, 7, 8],
   [0, 3, 6],
   [1, 4, 7],
   [2, 5, 8],
   [0, 4, 8],
   [2, 4, 6]
 ]

var turn = 0


function getBoard() {
  squares = document.querySelectorAll('td')
  return squares
}


// sets the player token to X or O
var player = () => turn % 2 ? 'O' : 'X';

// setMessage() Accepts a string and adds it to the div#message element in the DOM.
var setMessage = (note) => {
  $('#message').html('<p>' + note + '</p>')
}

function updateState(square) {
    var token = player();
    $('square').text(token)
}

function checkWinner(board) {
  
  var position_1 = winningCombos[0]
  var position_2 = winningCombos[1]
  var position_3 = winningCombos[2]

  // for (const combo of winningCombos) {
  //
  // }
}

function doTurn() {

}
