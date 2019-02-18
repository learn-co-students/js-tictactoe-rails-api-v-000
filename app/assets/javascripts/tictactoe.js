const WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Returns the token of the player whose turn it is, 'X' when the turn variable is even and 'O' when it is odd.
var turn = 0;

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

$(document).ready(function() {
  attachListeners();
});

// Attaches the appropriate event listeners to the squares of the game board as well as for the button#save, button#previous, and button#clear elements.
// When a user clicks on a square on the game board, the event listener should invoke doTurn() and pass it the element that was clicked.
function attachListeners() {
  square = document.querySelector("td");
  $("td").click(function() {
    doTurn(this);
  });
}

// Increments the turn variable by 1.
// Invokes the updateState() function, passing it the element that was clicked.
// Invokes checkWinner() to determine whether the move results in a winning play.
function doTurn(square) {
  turn += 1;
  updateState(square);
  console.log(turn);

  if (checkWinner()) {
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    resetBoard();
  }
}

// Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board.
function updateState(square) {
  let token = player();
  $(square).text(token);
}

// Accepts a string and adds it to the div#message element in the DOM.
function setMessage(string) {
  console.log(string);
  $("#message").text(string);
}

// Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally). Otherwise, returns false.
// If there is a winning combination on the board, checkWinner() should invoke setMessage(), passing in the appropriate string based on who won: 'Player X Won!' or 'Player O Won!'
function checkWinner(params) {
  var winner = false;
  var board = {};

  // generate board object
  $("td").text((index, square) => (board[index] = square));

  WIN_COMBINATIONS.forEach(position => {
    if (
      board[position[0]] === board[position[1]] &&
      board[position[1]] === board[position[2]] &&
      board[position[0]] !== ""
    ) {
      setMessage(`Player ${board[position[0]]} Won!`);
      return (winner = true);
    }
  });

  return winner;
}

function resetBoard() {
  $("td").empty();
  turn = 0;
}
