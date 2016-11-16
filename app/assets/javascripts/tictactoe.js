attachListeners()
// you must have a function called attachListeners() 
// which the tests call to attach the click handlers to the page after the DOM has been loaded
// When a client clicks on a cell, the function doTurn() should be called and passed a parameter of the event

doTurn()
// Increment the variable turn by one
// Should call on the function updateState() and pass it the event
// Should call on checkWinner()

player()
// If the turn number is even, this function should return the string "X", else it should return the string "O"

updateState()
// This method should call on player() and add the return value of this function to the clicked cell on the table

checkWinner()
// This function should evaluate the board to see if anyone has won
// If there is a winner, this function should make one of two strings: "Player X Won!" or "Player O Won!". It should then pass this string to message().

message()
// This function should accept a string and add the string to the div with an id of "message"
