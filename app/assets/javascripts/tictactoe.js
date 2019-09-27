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
  // Add event listeners to tic tac toe board squares
  var squares = window.document.querySelectorAll('td');
  // for (let i = 0; i < 9; i++) {
  //   squares[i].addEventListener('click', function (e) {
  //     // IE 8 stuff :(
  //     e = e || window.event;
  //   	var square = e.target || e.srcElement;
  //     doTurn(square);
  //   });

  // Hook up gmae buttons
  document.getElementById("save").addEventListener('click', saveGame);
  document.getElementById("previous").addEventListener('click', previousGame);
  document.getElementById("clear").addEventListener('click', clearGame);
}

function saveGame () {
  console.log("save button pressed")
}

function previousGame () {
  console.log("previous button pressed")
}

function clearGame () {
  turn = 0;
  for (let i = 0; i < 9; i++) {
    squares[i].innerHTML = "";
  }
  setMessage("");
  console.log("clear button pressed")
}

function player () {
  return turn % 2 == 0 ? "X" : "O";
}

function updateState (square) {
  var playerToken = player();
  var squares = window.document.querySelectorAll('td');

  if (square.innerHTML.length == 0 && turn <= 9) {
    square.innerHTML = playerToken;
  } else if (turn > 9){

  }
}

function checkWinner () {
  var squares = window.document.querySelectorAll('td');
  var winner = "";
  var winCombinations = [
   [0,1,2],
   [3,4,5],
   [6,7,8],
   [0,3,6],
   [1,4,7],
   [2,5,8],
   [0,4,8],
   [2,4,6]
 ]

 winCombinations.forEach(checkCombination);

 function checkCombination (combo, index) {
   if (squares[combo[0]].innerHTML == "X" && squares[combo[1]].innerHTML == "X" && squares[combo[2]].innerHTML == "X") {
     winner = "X"
   } else if (squares[combo[0]].innerHTML == "O" && squares[combo[1]].innerHTML == "O" && squares[combo[2]].innerHTML == "O") {
     winner = "O"
   }
 }

 if (winner == "X" || winner == "O") {
   setMessage(`Player ${winner} Won!`);
   return true;
 } else {
   return false;
 }
}

function setMessage (message) {
  document.getElementById("message").innerHTML = message;
}

function doTurn (square) {
  // IE 8 stuff :(
  // e = e || window.event;
	// var square = e.target || e.srcElement;
  // debugger;
  // Back to regular stuff
  turn++;
  updateState(square);
  var gameWon = checkWinner();
  if (gameWon == true) {
    turn = 0;
    clearGame();
  } else if (turn > 8) {
    setMessage("Tie game.");
  }
}
