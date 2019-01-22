var turn = 0;


$(document).ready(function(){
	attachListeners();
});


function player() {
	if(turn % 2 == 0 ) {
		return "X";
	} else {
		return "O";
	}
}

function updateState(square) {
	let currentPlayer = player();
	$(square).append(currentPlayer);
}

function setMessage(string) {
	$("div#message").append(string);
}


function checkWinner() {
	var board = {};
	var winner = false;
	// returns true when a player wins horizontally
	// returns true when a player wins diagonally
	// returns true when a player wins vertically
	// returns false if no winning combination is present on the board
	
	$('td').text( (index, square) => board[index] = square);
	let winCombinations = [
	  [0, 1, 2],
	  [3, 4, 5],
	  [6, 7, 8],
	  [0, 3, 6],
	  [1, 4, 7],
	  [2, 5, 8],
	  [0, 4, 8],
	  [6, 4, 2]
	];

	winCombinations.forEach(function(position) {
		if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
		setMessage(`Player ${board[position[0]]} Won!`)
		winner = true;
		}
	})
	return winner;
}

function doTurn(square) {
	updateState(square);
	turn++;

	if (checkWinner(turn) === true) { 
		turn = 0;
		board = {};
		$('td').empty(); 
	} else if (turn === 9) {
		setMessage(`Tie game.`);
	};
}

function gameOver() {
	let gameOver = false;
	if (checkWinner() === true || setMessage() === `Tie game.`) {
	gameOver = true;
};
	return gameOver;
}


function attachListeners(){
	$('td').on("click", function() {
	// check if square is empty and if so allow the player to take turn
	if (this.innerHTML === "" && gameOver() === false) {
		doTurn(this);
	};
	
	});
}


