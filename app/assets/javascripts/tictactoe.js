// Code your JavaScript / jQuery solution here
$(document).ready(function() {
	attachListeners();
})


const winningArray = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
var turn = 0;

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

function attachListeners() {
		gameBoardCells().forEach(function(cell) {
			cell.addEventListener("click", function(e) {
				console.log("clicked on cell: ", reportPosition(this));
				if (!checkWinner())	 {
					doTurn(this);
				}
			})
		})

		$("#previous").on("click", function() {
			$.get("/games", function(resp) {
				resp.data.forEach(function(game) {
					
				});
			});
		});
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
	let token = player()
	// console.log("turn: ", turn)
	// console.log("playing", token, " on ", cell.attributes)
	cell.innerHTML = token
	// console.log("update board: ", showBoard())
}

function setMessage(text) {
	messageBox = $("#message")
	messageBox.text(text)
}

function checkWinner() {
	let currentBoard = gameBoardCells()
	let winner = false
	winningArray.forEach(function(combo) {
		// if 3 cells of a winning combo match && one of them isn't empty
		if (currentBoard[combo[0]].textContent === currentBoard[combo[1]].textContent && 
			currentBoard[combo[1]].textContent === currentBoard[combo[2]].textContent && 
			currentBoard[combo[0]].textContent !== "") {
			setMessage(`Player ${currentBoard[combo[0]].textContent} Won!`)
			// console.log('winning combo: ', showBoard())
			winner = true
		}
	})
	return winner
}

function showBoard() {
	return gameBoardCells().map(function(cell) {
		return cell.textContent;
	})
}

function resetBoard() {
	gameBoardCells().forEach(function(cell) {
		cell.textContent = "";
	})
	turn = 0;
}

function doTurn(cell) {
	if (cell.textContent === "") {
		updateState(cell);
		turn++;
		if (checkWinner()) {
			resetBoard();
		} else if (turn === 9) {
			setMessage("Tie game.")
			resetBoard();
		}
	}
}