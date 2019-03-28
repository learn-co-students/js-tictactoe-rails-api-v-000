// Code your JavaScript / jQuery solution here
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

function player() {
	let turn = 9
	gameBoardCells().forEach(function(cell) {
		// 
		if (cell.textContent !== "") {
			turn--
		}
	})
	console.log("player called with " + turn + " empty cells")
	// if the turn number is even, return 'O'
		if (turn % 2 === 0) {
			return "O"
		} else {
			return "X"
		}
}

$(document).ready(function() {
	const attachListeners = function() {
		gameBoardCells().forEach(function(cell) {
			cell.addEventListener("click", function(e) {
				console.log("clicked on cell: ", reportPosition(this))
			})
		})
	}

	attachListeners()
})