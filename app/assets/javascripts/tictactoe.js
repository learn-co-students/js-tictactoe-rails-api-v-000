
var currentPlayer
var prevGamesArr
var prevSaved = 0
var turn = 0
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
		return 'X'
	} else {
		return 'O'
	}
  
}

function updateState(square) {
	// adds the current player's token to the passed-in <td> element
	currentPlayer = player()
	
	if (square.textContent == "") {
		// Users can only place a token in a square that is not already taken
		$(square).text(currentPlayer)
	} else turn -= 1	
}

function setMessage(msg) {
	// sets a provided string as the innerHTML of the div#message element
	$('#message').text(msg)	  
}

function checkWinner() {
	// checks if current player has won (horizontally, vertically, or diagonally)
	// invokes the setMessage() function with the argument 'Player X Won!' or 'Player O Won!'
	board = document.querySelectorAll('td')
	result = 'none'
	$.each(winCombos, function( index , value) {
		
		if (board[value[0]].textContent == 'X' && 
			board[value[1]].textContent == 'X' && 
			board[value[2]].textContent == 'X'){
		  result = 'X'  
		} else if (board[value[0]].textContent == 'O' && 
			 	   board[value[1]].textContent == 'O' && 
			 	   board[value[2]].textContent == 'O') {
				result = 'O'
		}
		
	});

	if (result == 'none') {
		return false		
	} else {
		msg = `Player ${result} Won!`
		setMessage(msg)
		return true
	}
}

function doTurn(square) {
	// updates the play state, checks for a winner, and sends a 'Tied Game.' message for a tied game
	updateState(square)

	checkWinner()

	if (result == 'none') {
	  // game not won or tied
	} else {
			// resets the board and the "turn" counter when a game is won
			turn = 0
			prevSaved = 0
			for (let i = 0; i < 9; i++) {
			    board[i].innerHTML = ''
			}
			return
		}
	// converts 'board' object to an array and checks for a tied game
	boardArray = Array.from(board)
	boardFull = boardArray.filter(elem => elem.textContent == '')

	if (boardFull.length == 0) {
		// resets the board and the "turn" counter when a game is tied
		msg = 'Tie game.'
		setMessage(msg)
		turn = 0
		prevSaved = 0
		for (let i = 0; i < 9; i++) {
		    board[i].innerHTML = ''
		}
		return
	}

	turn += 1  
}

function clickHandler() {
    // 'this' refers to the element the event was hooked on  
    square = this
    doTurn(square)    
}

function attachListeners() {

		document.querySelectorAll('td')
		.forEach(e => e.addEventListener('click', clickHandler));

		document.getElementById('save').addEventListener('click', saveGame)

		document.getElementById('previous').addEventListener('click', previousGame)

		document.getElementById('clear').addEventListener('click', clearBoard)
}

window.onload =	attachListeners

function saveGame() {

	$.post('/games') 

	// $.patch('/games/:id')
}

function previousGame() {

	$.get("/games", function(data) {
		
		prevGamesArr = data['data']
		
		if (prevGamesArr.length > 0 && prevGamesArr.length > prevSaved) {
			
			newSaved = (prevGamesArr.length - prevSaved)
			
			for (let i = 1; i <= newSaved; i++) {
				  prevId = prevGamesArr[prevGamesArr.length-1].id
		    	  $('#games').append(`<BUTTON> <li><a href='/games/${prevId}'>${prevId}</a></li></BUTTON>`)
		    	}
		    	
		    prevSaved += newSaved
		}
		
    })
}

function clearBoard() {

	alert('clear clicked!')
}

