// Code your JavaScript / jQuery solution here
const WIN_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,4,8],
  [2,4,6],
  [0,3,6],
  [1,4,7],
  [2,5,8]
];

var turn = 0;
var currentGameId = 0;

var player = function() {
	return turn % 2 ? "O" : "X";
};

$(function() {
	attachListeners();
});


function attachListeners() {
	$("td").click(function() {
		if (!this.textContent && !checkWinner()) {
			//prevent clicking on Won Games that were persisted
			doTurn(this);
		}
	});

	$("#previous").click(function() {
		previousGames();
	});

	$("#save").click(function() {
		saveGame();
	});

	$("#clear").click(function() {
		resetGame();
	});
}

function doTurn(arg) {
	updateState(arg);
	turn++;
	if (checkWinner()) {
		saveGame();
		resetGame();
	} else if (turn === 9) {
		setMessage("Tie game.");
		saveGame();
		resetGame();
	}
}

function updateState(arg) {
	arg.textContent = player();
}

function setMessage(message) {
	$("#message").text(message);
}

function checkWinner() {
	var winner = false;
	var board = [];
	$("td").text(function(index, td) {
		board.push(td);
	});

	WIN_COMBINATIONS.some(function(position) {
		if (
			board[position[0]] !== "" &&
			board[position[0]] === board[position[1]] &&
			board[position[1]] === board[position[2]]
		) {
			setMessage(`Player ${board[position[0]]} Won!`);
			return (winner = true);
		}
	});

	return winner;
}

function reloadGame(id) {
	$("#message").text("");
	$.get(`/games/${id}`, function(game) {
		var state = game.data.attributes.state;
		turn = state.filter(String).length;
		currentGameId = id;

		$("td").each(function(index) {
			this.innerHTML = state[index];
		});

		if (!checkWinner() && turn === 9) {
			setMessage("Tie game.");
		}
	});
}

function resetGame() {
	$("td").empty();
	turn = 0;
	currentGameId = undefined;
}

function saveGame() {
	var gameState = [];
	var gameData;

	$("td").text(function(index, square) {
		gameState.push(square);
	});

	gameData = { state: gameState };

	if (currentGameId) {
		$.ajax({
			method: "PATCH",
			url: `/games/${currentGameId}`,
			data: gameData
			//data: JSON.stringify(checkBoardState()),
			//success: function(game) {
			//currentGameId = game.data.id;
		});
	} else {
		$.post("/games", gameData, function(game) {
			currentGameId = game.data.id;
			$("#games").append(
				`<button id="gameId-${game.data.id}">Game - ${game.data.id}</button><br>`
			);
			$("#gameId-" + game.data.id).click(function() {
				reloadGame(game.data.id);
			});
		});
	}
}

function previousGames() {
	//alert("Working!");
	$("#games").empty();
	$.get("/games", function(game) {
		game.data.forEach(function(element) {
			$("#games").append(
				`<button id="gameId-${element.id}">Game - ${element.id}</button><br><br>`
			);
			$("#gameId-" + element.id).click(function() {
				reloadGame(element.id);
			});
		});
	});
}
