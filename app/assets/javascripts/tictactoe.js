// Code your JavaScript / jQuery solution here

var turn = 0
var currentPlayer = ""
const WIN_COMBINATIONS =
      [
        [0,1,2], // top row
        [3,4,5], // middle row
        [6,7,8], // bottom row
        [0,3,6], // left column
        [1,4,7], // middle column
        [2,5,8], // right column
        [0,4,8], // left diagonal
        [2,4,6]  // right diagonal
      ]

function player() {

	if (turn % 2 == 0) {
		// turnCount += 1
		return "X"
	} else {
		// turnCount += 1
		return "O"
	}
  
}

function updateState() {

	currentPlayer = player()
  	
}

function setMessage() {
  
}

function checkWinner() {
  
}

function doTurn() {
  
}

function attachListeners() {
  
}

function saveGame() {
  
}

function previousGame() {
  
}
