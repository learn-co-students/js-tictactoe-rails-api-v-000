// Code your JavaScript / jQuery solution here

// button#save
// Clicking this button should save the current game state. If the current game already exists in the database, saving it should update that previously-saved game. If the current game has not yet been persisted to the database, saving it should do so. As a brief example, if we start with a blank board that has not been saved and click button#save, the current game should be persisted to our database. If we then click button#save a second time, the persisted game should be updated (though, since we have yet to make any moves, the board will still be blank in the updated game state).
//
// button#previous
// Clicking this button should grab all of the persisted games from the database and create a button for each that, when clicked, returns that saved game's state to our tic-tac-toe board. All of the buttons should be added to the div#games element in the DOM.
//
// button#clear
// Clicking this button should clear the game board and start a completely new game. If we click button#save, then button#clear, and then button#save again, two games should have been persisted to the database.
var turn = 0;

window.onload = function () {
  attachListeners();
};

function attachListeners () {
  var squares = window.document.querySelectorAll('td');
  // debugger;
  for (let i = 0; i < 9; i++) {
    squares[i].addEventListener('click', doTurn);
  }
}

function player () {
  return turn % 2 == 0 ? "X" : "O";
}

function updateState (square) {
  var playerToken = player();
  if (square.innerHTML.length == 0) {
    square.innerHTML = playerToken;
  }
}

function checkWinner () {
  var squares = window.document.querySelectorAll('td');
  // add every possible win to nested array as number
  // add up every item in array if == 3 then "X" won if === 8 then "O" won
  //
  var possibleWins = []

  setMessage();
}

function setMessage (message) {

}

function doTurn (e) {
  // IE 8 stuff :(
  e = e || window.event;
	var square = e.target || e.srcElement;

  // Back to regular stuff
  turn += 1;
  updateState(square);
  checkWinner();
}
