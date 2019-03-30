// Code your JavaScript / jQuery solution here
const winningArray = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
var turn = 0;
var game;

class Game {
	constructor(state = ['','','','','','','','',''], id = '') {
		this.state = state;
		this.id = id;
	}
}

class Board {
	static cellElementArray() {
		return $('td').toArray()
	}

	static cellTextArray() {
		return Board.cellElementArray().map(function(cell) {
			return cell.textContent;
		})
	}

	static updateState(cell) {
		let token = player()		
		cell.innerHTML = token
	}

	static resetBoard() {
		Board.cellElementArray().forEach(function(cell) {
			cell.textContent = "";
	})

	turn = 0;
	}
}

$(document).ready(function() {
	attachListeners();
	game = new Game
})

const xPos = function(td) {
	return $(td).data("x");
}

const yPos = function(td) {
	return $(td).data("y");
}

const arrayPosition = function(x, y) {
	return x + y * 3;
}

const reportPosition = function(td) {
	return arrayPosition(xPos(td), yPos(td))
}

const gameBoardCells = function() {
	return $('td').toArray()
}

function attachListenerToClear() {
	$("#clear").on("click", function() {
		resetBoard();
		game.id = '';
	})
}

function attachGameButtonListener(button) {
	button.addEventListener("click", function(e) {
		console.log("game button pressed: ", $(this).data("id"))
		$.get('/games/' + $(this).data('id'), function(resp) {
			loadGame(resp);
		})
	});
}

function attachListenerToPrevious() {
	$("#previous").on("click", function() {
		$.get("/games", function() {
		}).done(function(resp) {
			// reset div#games
			clearGamesDiv();

			resp.data.forEach(function(game) {
				newButton = document.createElement('button');
				newButton.textContent = `Game ${game.id}`;
				newButton.setAttribute('data-id', game.id);
				attachGameButtonListener(newButton);
				$("#games").append(newButton, 'last updated: ', game.attributes["updated-at"], '<br>')
			});
		});
	});
}

function loadGame(resp) {
	game.id = parseInt(resp.data.id)
	turn = 0
	clearGamesDiv();
	// load the values of the game
	gameBoardCells().forEach(function(cell, index) {
    	cell.textContent = resp.data.attributes.state[index]
    	if (cell.textContent) { turn++ }
});
}

function attachListenersToGridCells() {
	gameBoardCells().forEach(function(cell) {
		cell.addEventListener("click", function(e) {
			console.log("clicked on cell: ", reportPosition(this));
			if (!checkWinner())	 {
				doTurn(this);
			}
		})
	})
}

function saveGame() {
	let gameData = {'state': Board.cellTextArray()}
	// if this is an already existing game
	if (game.id) {
		gameData['id'] = game.id;
		$.ajax({
			url: `/games/${game.id}`,
			method: 'PATCH',
			data: gameData,
			done: function(resp) {
				loadGame(resp);
			}
		});
	} else {
		$.post('/games', gameData).done(function(resp) {
			loadGame(resp);
		})
	}
}

function attachListenerToSave() {
	$('#save').on('click', function(){
		saveGame();	
	})
}

function attachListeners() {
	attachListenersToGridCells();	
	attachListenerToPrevious();
	attachListenerToSave();
	attachListenerToClear();	
	}

function player() {
		console.log("player turn: ", turn)
		if (turn % 2 === 0) {
			return "X"
		} else {
			return "O"
		}
	}

function updateState(cell) {
	Board.updateState(cell)
}

function setMessage(text) {
	messageBox = $("#message")
	messageBox.text(text)
}

function displayGames(text) {
	gameBox = $("#games")
	gameBox.html(text)
}

function clearGamesDiv() {
	$("#games").empty();	
}

function checkWinner() {
	let currentBoard = gameBoardCells()
	let winner = false
	winningArray.forEach(function(combo) {
		// if 3 cells of a winning combo match && one of them isn't empty
		if (currentBoard[combo[0]].textContent === currentBoard[combo[1]].textContent && 
			currentBoard[combo[1]].textContent === currentBoard[combo[2]].textContent && 
			currentBoard[combo[0]].textContent !== "") {
			saveGame();
			setMessage(`Player ${currentBoard[combo[0]].textContent} Won!`)
			winner = true
		}
	})
	return winner
}

function resetBoard() {
	Board.resetBoard()
}

function doTurn(cell) {
	if (cell.textContent === "") {
		updateState(cell);
		turn++;
		if (checkWinner()) {
			resetBoard();
		} else if (turn === 9) {
			setMessage("Tie game.")
			saveGame();
			resetBoard();
		}
	}
}