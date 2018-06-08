// Code your JavaScript / jQuery solution here

var turn = 0
var currentPlayer = ""
var winner = ""
var msg = ""
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
	// Returns 'X' when the turn variable is even and 'O' when it is odd
	if (turn % 2 == 0) {
		return "X"
	} else {
		return "O"
	}
  
}

function updateState() {

	currentPlayer = player()
  	alert("updateState: currentPlayer")
}

function setMessage(msg) {

	  
}

function checkWinner() {

	msg = `Player ${winner} Won!`
	setMessage(msg)	
  
}

function doTurn() {

	turn += 1
	updateState()
	checkWinner()
  
}

function clickHandler() {
    // Here, `this` refers to the element the event was hooked on
    alert(this + " clicked")
}


function attachListeners() {

		document.querySelectorAll('td')
		.forEach(e => e.addEventListener("click", clickHandler));

		document.getElementById('save').addEventListener("click", saveGame)


		document.getElementById('previous').addEventListener("click", previousGame)


		document.getElementById('clear').addEventListener("click", clearBoard)
	  
	}
window.onload =	attachListeners

function saveGame() {

	alert("save clicked!")
  
}

function previousGame() {

	alert("previous clicked!")
	  
}

function clearBoard() {

	alert("clear clicked!")
  
}


