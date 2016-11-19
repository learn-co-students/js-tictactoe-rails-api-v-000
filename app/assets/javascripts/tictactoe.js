// The grid is made by a table. Each square is in a table row, or tr and each square is a table data, or td (you could also call this a cell).
// Each td has two data attributes: x and y coordinates. The top left td had an x of 0 and a y of 0.

var turn = 0;

function attachListeners() { // COMPLETE
// You must have a function called attachListeners() which the tests call to attach the click handlers to the page after the DOM has been loaded
// When a client clicks on a cell, the function doTurn() should be called and passed a parameter of the event
  $('td').click(function(move) {
    doTurn(move);
  });
}

function board() { // COMPLETE
  return $('td').map(function(index, square) {
    return square.innerHTML;
  });
}

function doTurn(move) { // COMPLETE
  // Increment the variable turn by one
  // Should call on the function updateState() and pass it the event
  // Should call on checkWinner()
  updateState(move.target);

  turn++;
  checkWinner();
}

function player() {  // COMPLETE
  // If the turn number is even, this function should return the string "X", else it should return the string "O"
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(move) { // COMPLETE
  // This method should call on player() and add the return value of this function to the clicked cell on the table
  $(move).text(player());
}

function checkWinner() {
  // This function should evaluate the board to see if anyone has won
  // If there is a winner, this function should make one of two strings: "Player X Won!" or "Player O Won!". It should then pass this string to message().
  if (board()[0] === board()[1] && board()[1] === board()[2] && board()[2] !== "") {
    return message("Player " + board()[0] + " Won!");
  } else if (board()[3] === board()[4] && board()[4] === board()[5] && board()[5] !== "") {
    return message("Player " + board()[3] + " Won!");
  } else if (board()[6] === board()[7] && board()[7] === board()[8] && board()[8] !== "") {
    return message("Player " + board()[6] + " Won!");
  } else if (board()[0] === board()[4] && board()[4] === board()[8] && board()[8] !== "") {
    return message("Player " + board()[0] + " Won!");
  } else if (board()[2] === board()[4] && board()[4] === board()[6] && board()[6] !== "") {
    return message("Player " + board()[2] + " Won!");
  } else if ($.inArray("", board()) === -1) {
    return message("Cats Game");
  } else {
    return message("It is " + player() + "s turn to go");
  }
}

function message(string) { // COMPLETE
  // This function should accept a string and add the string to the div with an id of "message"
  $('#message').html("<h4>" + string + "</h4>");
}



$(function() {
  attachListeners();
});
