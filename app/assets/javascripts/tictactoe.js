var turn = 0;

winners = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [7, 5, 3]
]

function attachListeners() {
  // When a client clicks on a cell,
  // the function doTurn() should be called and passed a
  // parameter of the event
}


function player() {
  // Should return the string "X",
  // else it should return the string "O"
  if ((turn % 2) == 0) {
    return "X"
  } else {
    return "O"
  }
};


function updateState(clickedCell) {
  // Should call on player() and add the return
  // value of this function to the clicked cell on the table
  clickedCell.text(player());
};

function token(clickedCell) {
  // Returns token value of current player
  clickedCell.text();
}

function checkWinner() {
  // Should evaluate the board to see if anyone has won

}

function message() {
  // Should accept a string and add the string to the
  // div with an id of "message"

}
