// Code your JavaScript / jQuery solution here

const WINNING_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7], [2,5,8],[0,4,8],[2,4,6]]

var turn = 0

function player () {
	return (turn % 2 == 0) ? 'X' : 'O'
}

function updateState (square) {
	$(square).text(player())
}


function setMessage(string) {
	$("div#message").html(string)
}

function checkWinner() {
	var board = {}
	var won = false

	$('td').text((index,square) => board[index] = square)

	WINNING_COMBOS.forEach (function (position) {

		if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
			setMessage(`Player ${board[position[0]]} Won!`)
			won = true
		}
	})
	return won
}



function doTurn(square) {
	updateState(square)
	turn++
	if (checkWinner()) {
		$('td').empty()
		turn = 0
	} else if (turn === 9) {
		setMessage("Tie game.")
	}
}



function attachListeners(square) {
	debugger

	$('td').on('click', function () {
		console.log(this)
		doTurn(square)
	})
	

}



















