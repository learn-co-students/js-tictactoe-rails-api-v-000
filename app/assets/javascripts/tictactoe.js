var turn = 0
var currentGame = 0

$(function () {
	attachListeners()
})

function attachListeners() {
	$("td").on("click", function (event) {
		if(this.innerHTML === "" && checkWinner() === false && checkTie() === false) {
					doTurn(this)
		}
	})

	$("#previous").on("click", function(event) {
		$.get("/games", function(callback) {
			if (callback["data"].length > 0) {
				$("#games").empty()
				callback["data"].forEach(function(game) {
					var gameId = game["id"]
					$("#games").append(`<button class="gameButton">${gameId}</button>`)
				})
				loadGame()		
			}	
		})
	})

	$("#save").on("click", function(event) {
		if(currentGame === 0) {
			save()
		} else {
			updateGame()
		}
		resetBoard()
	})

	$("#clear").on("click", function(event) {
		resetBoard()
	})
}

function save() {
	$.post( "/games", { state: currentBoard() })
  .done(function(data) {
  	currentGame = data["data"]["id"]
  });
}

function updateGame() {
	$.ajax({
		url:"/games/" + currentGame,
		method: "PATCH",
		dataType: "json",
		data: { state: currentBoard() }
	})
}

function player() {
	return (turn % 2 === 0 ? "X" : "O")
}

function loadGame() {
	$(".gameButton").on("click", function(event) {
		var gameId = this.innnerHTML
		currentGame = this.innerHTML
		$.get("/games/" + this.innerHTML, function(callback) {
			var gameState = callback["data"]["attributes"].state
			var gameBoard = $('td')
			for(var i = 0; i < gameBoard.length; i++) {
				gameBoard[i].innerHTML = gameState[i]
			}
			setTurn()
		})
	})
	
}

function setTurn() {
	turn = 0
	var board = currentBoard()
	board.forEach(function(move) {
		if (move === "X" || move ==="O") {
			turn++
		}
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
	$('td').html("")
	turn = 0
	currentGame = 0
}

function doTurn(position) {
	updateState(position)	
		turn ++
	if (checkWinner() || checkTie()) {
		save()
		resetBoard()
	}
}

