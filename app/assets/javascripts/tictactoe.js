// The grid is made by a table. Each square is in a table row, or tr and each square is a table data, or td (you could also call this a cell).
// Each td has two data attributes: x and y coordinates. The top left td had an x of 0 and a y of 0.

function attachListeners() {
// You must have a function called attachListeners() which the tests call to attach the click handlers to the page after the DOM has been loaded
// When a client clicks on a cell, the function doTurn() should be called and passed a parameter of the event
}

function doTurn() {
// Increment the variable turn by one
// Should call on the function updateState() and pass it the event
// Should call on checkWinner()
}

function player() {
// If the turn number is even, this function should return the string "X", else it should return the string "O"
}

function updateState() {
// This method should call on player() and add the return value of this function to the clicked cell on the table
}

function checkWinner() {
// This function should evaluate the board to see if anyone has won
// If there is a winner, this function should make one of two strings: "Player X Won!" or "Player O Won!". It should then pass this string to message().
}

function message() {
// This function should accept a string and add the string to the div with an id of "message"
}
