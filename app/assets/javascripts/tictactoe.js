// Code your JavaScript / jQuery solution here
var turn = 0;
var board = []
var gameId = 0
var winningCombinations = [
	[0,1,2], //top row
	[3,4,5], //middle row
	[6,7,8], //bottom row
	[0,3,6], //left row
	[1,4,7], //middle row
	[2,5,8], //right row
	[0,4,8], //diagonal left to right
	[2,4,6] //diagonal right to left
]

 function player() {
	return turn % 2 === 0 ? 'X' : 'O'
}

 function updateState(square) {
	if (squareAvailable) {
		return $(square).text(player());
	}
};

 function squareAvailable(square) {
	return $(square).text === "" ? true : false
}

 function setMessage(string) {
	return $('div#message').append(string + "<br>")
}

 function getBoard() {
	$("td").text((i, square) => {
		board[i] = square
	});
}

 function checkWinner() {
	let winner = false
	getBoard();
	winningCombinations.forEach(function(combo) {
		position1 = board[combo[0]]
		position2 = board[combo[1]]
		position3 = board[combo[2]]
 		let threeXInARow = (position1 == 'X' && position2 == 'X' && position3 == 'X')
		let threeYInARow = (position1 == 'O' && position2 == 'O' && position3 == 'O')
 		if (threeXInARow || threeYInARow) {
			setMessage(`Player ${position1} Won!`)
			winner = true
			saveGame()
		}
	});
	return winner
}

 function doTurn(square) {
	updateState(square)
	turn ++
	getBoard()
 	if (checkWinner()) {
		saveGame()
		resetBoard()
	} else if (turn === 9) {
		setMessage('Tie game.')
		saveGame()
		resetBoard()
	}
}

 function resetBoard() {
	turn = 0
	$("td").empty()
}

 function attachListeners() {
	$("td").on('click', function () {
		if (!checkWinner() && !$.text(this)) {
			doTurn(this)
		}
	})
	$("#save").on('click', function() {
		saveGame()
	});
	$("#previous").on('click', function() {
		previousGames()
	})
	$("#clear").on('click', function() {
		resetBoard()
		gameId = 0
	})
}

 function clearPreviousGames() {
	$('div#games').empty()
}

 function previousGames() {
	clearPreviousGames()
	$.get('/games', function (games) {
		if (games.data.length) {
			games.data.map(function(game) {
				$('div#games').append(`<button id="gameid-${game.id}">Show Game - ${game.id}</button><br>`)
				$(`#gameid-${game.id}`).on('click', function() {
					showGame(game.id);
				})
			})
		}
	})
}

 function showGame(gameID) {
	$.get(`/games/${gameID}`, function (game) {
		let state = game.data.attributes.state;
		$('td').text(i => state[i])
		gameId = gameID
		turn = state.reduce((acc, e) => acc + e).length
		checkWinner()
	})
}

 function saveGame() {
	let state = Array.from($('td'), e => e.innerText)
	if(gameId) {
		// Update the game if gameID is != 0
		$.ajax({
			type: 'PATCH',
			url: `/games/${gameId}`,
			dataType: 'json',
			data: {state: state}
		})
	} else {
		// Save the game if gameID = 0
		$.post('/games', {state: state}, function(game) {
			gameId = parseInt(game.data.id)
			})
	}
}

 $(document).ready(() => {
	attachListeners();
})
