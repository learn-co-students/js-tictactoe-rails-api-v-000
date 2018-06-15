
var currentId = 0
var msg = ''
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

function attachListeners() {

		document.querySelectorAll('td')
		.forEach(e => e.addEventListener('click', tdClickHandler))

		document.querySelector('#games').addEventListener('click', liClickHandler)

		document.getElementById('save').addEventListener('click', saveGame)

		document.getElementById('previous').addEventListener('click', previousGame)

		document.getElementById('clear').addEventListener('click', clearGame)
}

window.onload =	attachListeners

function tdClickHandler() {
    // 'this' refers to the element the event was hooked on  
    square = this
    doTurn(square)    
}

function liClickHandler(e) {
    // 'e' refers to the element the event was hooked on
    gameId = e.target.textContent
    // get the game whose button has been clicked
    getGame(gameId)
}

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
	
	if (square.textContent == '') {
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
	winner = 'none'
	
	$.each(winCombos, function( index , value) {
		
		// *** below is my preferred version but the test fails with it!!!!! ***
		// if (board[value[0]].textContent == currentPlayer && 
		// 	board[value[1]].textContent == currentPlayer && 
		// 	board[value[2]].textContent == currentPlayer){
		 		
		//  	 	winner = currentPlayer 
		// }

		if (board[value[0]].textContent == 'X' && 
			board[value[1]].textContent == 'X' && 
			board[value[2]].textContent == 'X'){
		  winner = 'X'  
		} else if (board[value[0]].textContent == 'O' && 
			 	   board[value[1]].textContent == 'O' && 
			 	   board[value[2]].textContent == 'O') {
				winner = 'O'
		}
		
	});
	
	if (winner == 'none') {
		return false		
	} else {
		msg = `Player ${winner} Won!`
		setMessage(msg)
		return true
	}
}

function doTurn(square) {
	// updates the play state, checks for a winner, and sends a 'Tied Game.' message for a tied game
	updateState(square)

	checkWinner()

	if (winner == 'none') {
	  // game not won or tied
	} else {
			// resets the board and the "turn" counter when a game is won
			saveGame()
			clearBoard()
			return
		}
	// converts 'board' object to an array and checks for a tied game
	boardArray = Array.from(board)
	boardFull = boardArray.filter(elem => elem.textContent == '')

	if (boardFull.length == 0) {
		// displays a 'Tie game.' message and resets the board and the "turn" counter when a game is tied
		msg = 'Tie game.'
		setMessage(msg)
		saveGame()
		clearBoard()
		return
	}

	turn += 1  
}

function getGame (gameId) {
	$.get('/games/' + gameId, function(data) {
		currentId = data['data'].id
		gameArr = data['data'].attributes.state
		// populate the board with the game just retrieved
		populateBoard(gameArr)
	})
	
}

function saveGame() {
	
	boardArr = Array.from(document.querySelectorAll('td'))
	// collect the board data to create or update a game in the database
	if (currentId >= 0) {
		dbGameArr = []
		for (let i = 0; i < 9; i++) {
	    	dbGameArr.push(boardArr[i].textContent)
	  	}
	  	newGame = {}
		newGame['state'] = dbGameArr
		// for patch
		url = '/games/'+ currentId;
        jsonString = JSON.stringify(newGame)
	}
	
	if (currentId == 0) {
		// create a new game if not already created
		posting = $.post('/games', newGame)
		posting.done(function(data) {
			currentId = data['data'].id
		})		 			

	} else if(currentId > 0) {
		// update an existing game
        $.ajax({
            type : 'PATCH',
            url : url,
            contentType: 'application/json',
            data : jsonString,
            error: function(xhr, status, error){
              alert(error)
            }
        })

	} else alert('** error ** Please try again! - Current ID: ' + currentId)
}

function previousGame() {
	// get games stored in the database
	newSaved = 0
	$.get('/games', function(data) {
		savedGamesArr = data['data']
		if (savedGamesArr.length > 0 && savedGamesArr.length > prevSaved) {
			// add game/s not already displayed to the displayed list with last-updated local time
			newSaved = (savedGamesArr.length - prevSaved)
			
			for (let i = newSaved; i <= newSaved && i >= 1; i--) {
				  prevId = savedGamesArr[savedGamesArr.length-i].id
				  updatedAt = data['data'][savedGamesArr.length-i].attributes['updated-at']
				  date = new Date(updatedAt)
				  time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
		    	  $('#games').append(`<button><li>${prevId}</li></button> ${time}<br>`)
		    	}

		    prevSaved += newSaved
		}
		
    })
}

function populateBoard(gameArr) {
	// popullate the board and update 'turn' count for the next player's go
	board = document.querySelectorAll('td')
	gameTurns = 0

  	for (let i = 0; i < 9; i++) {
    	board[i].innerHTML = gameArr[i]
    	if (gameArr[i] != '') {
    		gameTurns += 1
    	}
  	}

  	turn = gameTurns
}

function clearBoard() {

	currentId = 0
	turn = 0

	for (let i = 0; i < 9; i++) {
	    board[i].innerHTML = ''
	}
}

function clearGame() {

	currentId = 0
	msg = ''
	turn = 0
	setMessage(msg)
	
	if (typeof board !== 'undefined') {
		for (let i = 0; i < 9; i++) {
		    board[i].innerHTML = ''
		}
	}
}

