// Code your JavaScript / jQuery solution here
var turn = 0

// Add event listeners when (document).ready
$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  $('table').on("click", function() {
    alert("CLICKED")
  })
  $('td').on("click", function() {
    updateState(td);
  });
}

// Return token of current player
function player() {
  return (turn % 2 === 0) ? "X" : "O"
}

// Add token to passed in td element
function updateState(td) {
    $(td).text(player());
    turn ++
}

function setMessage(string) {
  $("#message").text(string);
}

// Check if game as been won (ie winning_combo exists)
function checkWinner() {
  const winning_combos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  board = {};
  $('td').text((i, token) => board[i] = token);
  for (let combo of winning_combos) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[0]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return true;
    };
  };
  return false;
}
