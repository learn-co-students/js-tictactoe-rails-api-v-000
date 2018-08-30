var turn = 0;
var board = []
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
	return $('div#message').append(string)
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
		} 
	});
	return winner
}