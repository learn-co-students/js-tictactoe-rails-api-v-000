var turn = 0

$(function () {
	attachListeners()
})

function player() {
	return (turn % 2 === 0 ? "X" : "O")
}

function attachListeners() {
	$("td").on("click", function (event) {
		if(this.innerHTML === "") {
					doTurn(this)
		}
	})



	$("#previous").on("click", function(event) {
		alert("previous")
	})

	$("#save").on("click", function(event) {
		alert("save")
	})

	$("#clear").on("click", function(event) {
		alert("clear")
	})
}

function updateState(position) {
	var token = player()
	position.innerHTML = token
}

function setMessage(string) {
	$("#message").html(string)
}

function currentBoard() {
	var boardArray = []
	boardData = $('td')
	for(var i = 0; i < boardData.length; i++) {
		boardArray[i] = boardData[i].innerHTML
	}
	return boardArray
}

function checkWinner() {
	var winningCombos = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	]

	var board = currentBoard()
	for(var i = 0; i < winningCombos.length; i++) {
		if (board[winningCombos[i][0]] != "" && board[winningCombos[i][0]] === board[winningCombos[i][1]] && board[winningCombos[i][1]] == board[winningCombos[i][2]]) {
			setMessage("Player " + board[winningCombos[i][0]] + " Won!")
			return true
		}
	}
	return false
}

function checkTie() {
	if (turn === 9 && checkWinner() === false) {
		setMessage("Tie game.")
		return true
	}
	return false
}

function resetBoard() {
	boardData = $('td')
	boardData.each(function(position) {
		boardData[position].innerHTML = ""
	})
}

function doTurn(position) {
	updateState(position)	
		turn ++
	if (checkWinner() || checkTie()) {
		resetBoard()
		turn = 0
	}
}

