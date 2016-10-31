var turn = 0;
var winCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

var attachListeners = function() {
// call to attach the click handlers to the page after the DOM has been loaded
//When a client clicks on a cell, the function doTurn() should be called and passed a parameter of the event

  $('td').on('click', function(event) {
    doTurn(event);
  })
}

var taken = function(turnEvent) {
  return !!$(turnEvent.target).html();
}

var doTurn = function(turnEvent) {
  // Increment the variable turn by one
  // Should call on the function updateState() and pass it the event
  // Should call on checkWinner()
      if(taken(turnEvent)){
        console.log("taken")
      } else {
      turn++;

      updateState(turnEvent);

      checkWinner();
      }
}

var updateState = function(turnEvent) {
//This method should call on player()
//and add the return value of this function to the clicked cell on the table

  var currentPlayer = player();
  $(turnEvent.target).text(currentPlayer);

}

var player = function() {
//If the turn number is even,
//this function should return the string "X", else it should return the string "O"
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}



var checkWinner = function() {
  //This function should evaluate the board to see if anyone has won
  //If there is a winner, this function should make one of two strings:
  //"Player X Won!" or "Player O Won!". It should then pass this string to message().

}

var message = function(string) {
  //This function should accept a string and add the string to the div with an id of "message"
  resetGame();
}

var resetGame = function() {
  turn = 0;
  $("td").html("");

}

$(function() {
  attachListeners();
});
