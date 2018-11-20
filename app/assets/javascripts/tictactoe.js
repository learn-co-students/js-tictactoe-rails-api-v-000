// Code your JavaScript / jQuery solution here
var turn = 0
const spaces = window.document.querySelectorAll('td');

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(square) {
  square.innerText = player();
}

function setMessage(str) {
  $('#message').append(str);
}

function checkWinner() {
  const winCombos = [
                    [0,1,2], 
                    [3,4,5], 
                    [6,7,8], 
                    [0,3,6], 
                    [1,4,7], 
                    [2,5,8], 
                    [0,4,8], 
                    [2,4,6]
                  ]

  var board = {};
  var winner = false;
  $('td').text(function(i, square) {
    board[i] = square;
  })
  winCombos.some(function(combo) {

    if (board[combo[0]] != "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;      
    }
  })
  return winner;
}

 function doTurn(square) {
  updateState(square);
  turn++
  if (checkWinner()) {
    checkWinner();
    $('td').empty();
    turn = 0;
  } else if (turn === 9) {
    setMessage('Tie game.')
  }
 } 

 function attachListeners() {
   if (!checkWinner() && turn !== 9) {
    $('td').click(function() {
      if (this.innerHTML === "") { 
        doTurn(this);
      }
    })
  }
 }

 $(document).ready(function() {
   attachListeners();
 });