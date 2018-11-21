// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;

function player() {
  return turn % 2 === 0 ? 'X' : 'O'
}

function updateState(square) {
  $(square).text(player())
}


function setMessage(str){
  $('div#message').text(str)
}


function checkWinner(){
  var winner = false;
  var board = {};
  const WIN_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
  ]

  $('td').text(function(index, str) {
    board[index] = str
  });

  WIN_COMBINATIONS.forEach(function(combo) {
    if (board[combo[0]] !== '') {
      if (board[combo[0]] === board[combo[1]] && board[combo[0]] === board[combo[2]]) {
        setMessage(`Player ${board[combo[0]]} Won!`);
        return winner = true;
      }
    }
  });

  return winner;
};
