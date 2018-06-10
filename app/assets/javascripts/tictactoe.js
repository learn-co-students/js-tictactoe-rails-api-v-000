
var turn = 0
var currentPlayer
var board
var boardArray
var boardFull
var square
var msg
var result
var winCombos =
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

function updateState(square) {

	currentPlayer = player()
	
	$(square).text(currentPlayer)	
}

function setMessage(msg) {

	$('#message').text(msg)	  
}

function checkWinner() {
	
	board = document.querySelectorAll('td')
	result = "none"
	$.each(winCombos, function( index , value) {
		
		if (board[value[0]].textContent == "X" && 
			board[value[1]].textContent == "X" && 
			board[value[2]].textContent == "X"){
		  result = "X"  
		} else if (board[value[0]].textContent == "O" && 
			 	   board[value[1]].textContent == "O" && 
			 	   board[value[2]].textContent == "O") {
				result = "O"
		}
		
	});

	if (result == "none") {
		return false		
	} else {
		msg = `Player ${result} Won!`
		setMessage(msg)
		return true
	}
}

function doTurn(square) {
	
	updateState(square)

	checkWinner()
	
	boardArray = Array.from(board)
	boardFull = boardArray.filter(elem => elem.textContent == "")

	if (boardFull.length == 0) {
		msg = "Tie game."
		setMessage(msg)
		turn = 0
		return
	}

	turn += 1  
}

function clickHandler() {
    // `this` refers to the element the event was hooked on 
    // var row = this.parentNode.rowIndex;
    // var col = this.cellIndex;  
    
    square = this
    doTurn(square)    
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

