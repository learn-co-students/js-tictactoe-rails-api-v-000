// Code your JavaScript / jQuery solution here

var turn = 0;

function player() {
  if (window.turn % 2 === 1) {
    return 'O';
  } else {
    return 'X';
  }
}

function updateState(square) {
  square.innerHTML = player();
  turn += 1
}

function setMessage(message) {
  $("#message").html(message);
}

const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
  ]
  
  const squares = window.document.querySelectorAll('td');

function checkWinner() {
  var i;
  var winner = 0;
  for (i = 0; i < wins.length; i++) { 
      if (squares[wins[i][0]].innerHTML == squares[wins[i][1]].innerHTML && squares[wins[i][0]].innerHTML == squares[wins[i][2]].innerHTML) {
        winner = squares[wins[i][0]].innerHTML
      } 
  } 
  if (winner) {
    setMessage(`Player ${winner} Won!`)
    return true

  } else {
    return false
  }
}


