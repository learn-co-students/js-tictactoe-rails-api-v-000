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
  const winCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

  // debugger;
  var board = {};
  var winner = false;
  $('td').text(function(i, square) {
    board[i] = square;
  })
  winCombos.some(function(combo) {

    if (board[combo[0]] != "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
      // debugger
      
    }
  })

  // for (let i = 0; i < Object.keys(winCombos).length; i++) {
  //   debugger
  //   Object.values(winCombos)[i].every(function(e, i, winCombos){
  //     if (e.textContent === "X") {
  //       winner = true;
  //     } else if (e.textContent === "O"){
  //       winner = true;
  //     } else {
  //       winner = false;
  //     }
  //   })
  // }
  return winner;
}

  function firstRow() {
    squares[0].innerText = "X"
    squares[1].innerText = "X"
    squares[2].innerText = "X"
  }


