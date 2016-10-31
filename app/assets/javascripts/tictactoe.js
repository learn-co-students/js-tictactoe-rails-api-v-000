var turn = 0;
var winCombinations = [
    ["00","10","20"], ["01","11","21"], ["02","12","22"],
    ["00","01","02"], ["10","11","12"], ["20","21","22"],
    ["00","11","22"], ["02","11","20"]
  ];

var attachListeners = function() {
// call to attach the click handlers to the page after the DOM has been loaded
//When a client clicks on a cell, the function doTurn() should be called and passed a parameter of the event

  $('body').on('click', 'td', function(event) {
    console.log(event);
    console.log(this);
    var turnEvent = this;
    doTurn(turnEvent);
  })
}

var getLocation = function(turnEvent) {

}

var doTurn = function(turnEvent) {
  // Increment the variable turn by one
  // Should call on the function updateState() and pass it the event
  // Should call on checkWinner()
  turn++;
  updateState(turnEvent);
  checkWinner();

}

var updateState = function(turnEvent) {
//This method should call on player()
//and add the return value of this function to the clicked cell on the table
  var currentPlayer = player();
  $(turnEvent).text(currentPlayer);

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
  if (true) {

  } else {

  }
}

var message = function(string) {
  //This function should accept a string and add the string to the div with an id of "message"

}

$(function() {
  attachListeners();
});
