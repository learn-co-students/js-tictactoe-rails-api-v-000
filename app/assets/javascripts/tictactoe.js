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

function checkWinner() {
  const squares = window.document.querySelectorAll('td');
  if (squares[0].innerHTML === squares[1].innerHTML === squares[2].innerHTML ||
    squares[3].innerHTML === squares[4].innerHTML === squares[5].innerHTML ||
    squares[6].innerHTML === squares[7].innerHTML === squares[8].innerHTML) {
    return "true"
  } else {
    return "non horizontal"
  }
  squares[1].innerHTML
}
