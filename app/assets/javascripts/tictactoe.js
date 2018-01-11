// Code your JavaScript / jQuery solution here


var turn = 0;
var WINNING_COMBOS = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
                      [0, 3, 6], [1, 4, 7], [2, 5, 8],
                      [0, 4, 8], [2, 4, 6]];


function player() {
  return (window.turn % 2 === 0) ? 'X' : 'O'
}

function updateState(cell) {
  cell.innerHTML = player();
}

function setMessage(message) {
  $("div#message").text(message)
}

function checkWinner() {
  var squares = $("td");
  var return_value = false;

  return WINNING_COMBOS.some(function(combo) {
    if ((squares[combo[0]].innerHTML !== "") && (squares[combo[0]].innerHTML === squares[combo[1]].innerHTML)
    && (squares[combo[0]].innerHTML === squares[combo[2]].innerHTML)) {
      var winner = squares[combo[0]].innerHTML;
      setMessage(`Player ${winner} Won!`);
      return_value = true;
      return return_value;
    }
  })
}
