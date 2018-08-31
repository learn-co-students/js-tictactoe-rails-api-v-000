$(document).ready(function() {
	attachListeners()
})

var turn = 0
var gameId = 0

function player() {
	if(turn % 2 === 0) {
		return "X"
	} else {
		return "O"
	};
};

function updateState(square) {
	if(square.innerHTML === "") {
		$(square).text(player());
		turn++
	} else {
		return false
	};
};

function setMessage(message) {
	$("#message").text(message);
};

function checkWinner() {
	const winningCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
	let board = []
	let winner = false
	$('td').text((index, player) => board[index] = player)

	for (let combo of winningCombinations) {
		if(board[combo[0]] === "X" && board[combo[1]] === "X" && board[combo[2]] === "X") {
			setMessage("Player X Won!")
			winner = true
		} else if(board[combo[0]] === "O" && board[combo[1]] === "O" && board[combo[2]] === "O") {
			setMessage("Player O Won!")
			winner = true
		}
	};
	return winner
};

function doTurn(square) {
	updateState(square)
	if(checkWinner() === true) {
		checkWinner()
		turn = 0
		saveGame()
		clearGame()
	} else if(turn === 9) {
		turn = 0 
		setMessage("Tie game.")
		saveGame()
		clearGame()
	};
};

function attachListeners() {
	$("td").on('click', function() {
		if(!checkWinner() && turn !== 9) {
			doTurn(this);
		};
	});
	$('#previous').on('click', () => previousGame());
	$('#save').on('click', () => saveGame());
	$('#clear').on('click', () => clearGame());
	$('.gamesButtons').on('click', () => getSavedGame());
};

function previousGame() {
	$('#games').empty()
	$.get("/games", function(games) {
		games.data.map(function(game) {
			$('#games').append(`<button onclick="getSavedGame(this)" data-id="${game.id}"id="game-${game.id}">Game: ${game.id}</button>`)
		});
	});
};

function saveGame() {
	var state = []
	$('td').text((index, player) => state[index] = player)
	if(gameId === 0) {
		var newGame = $.post('/games', {state: state})
		newGame.done(function(game) {
			gameId = game["data"].id;
		})
	} else {
		$.ajax({
			method: 'PATCH',
			url: `/games/${gameId}`,
			data: {state: state},
			dataType: "JSON"
		});
	};
};

function clearGame() {
	if(gameId === 0) {
		for(let text of $('td')) {
			text.innerHTML = ""
		};
		turn = 0
	} else {
		for(let text of $('td')) {
			text.innerHTML = ""
		};
		turn = 0
		gameId = 0
	};
};

function getSavedGame(info) {
	var id = info.dataset.id
	$.get(`/games/${id}`, function(game) {
		boardState = game["data"]["attributes"].state
		populateBoard(boardState);
		gameId = game["data"].id
		// debugger
		thing = boardState.map(function(index) {if(index !== "") {return index}}) 
		turn = thing.filter(n => n).length
	});
};

function populateBoard(arr) {
	var board = Array.from($("td"), s => s);
	// debugger
  	for (let i = 0; i < 9; i++) {
    	board[i].innerHTML = arr[i];
  	}
}









































