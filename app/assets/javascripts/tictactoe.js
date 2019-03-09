// Code your JavaScript / jQuery solution here


var turn = 0


// sets the player token to X or O
var player = () => turn % 2 ? 'O' : 'X';

function getBoard() {
  squares = document.querySelectorAll('td')
  return squares
}

// setMessage() Accepts a string and adds it to the div#message element in the DOM.
var setMessage = (note) => {
  $('#message').html('<p>' + note + '</p>')
}

function updateState(square) {
    var token = player();
    $(square).text(token)
}

function checkWinner() {
  var winner = false
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
  var board = []
  var currentState = $('td')

  currentState.text((i, square) =>  {
    board.push(square)
  })

  winningCombos.some(function(element) {
    var position_1 = board[element[0]]
    var position_2 = board[element[1]]
    var position_3 = board[element[2]]

    if (position_1 !== "" && position_1 === position_2 && position_2 === position_3) {
           setMessage(`Player ${board[element[0]]} Won!`);
           winner = true;
      }
  });
  return winner
}

function doTurn() {

}
