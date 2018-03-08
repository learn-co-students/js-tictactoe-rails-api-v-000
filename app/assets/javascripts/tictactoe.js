const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
let current_game = 0;

$(document).ready(function() { attachListeners(), window.turn = 0 })

function attachListeners() {
	let cells = $("td");
	for (let i = 0; i < cells.length; i++) {
		cells[i].addEventListener("click", function() {
			doTurn(this);
		}, false);
	}
	$("#clear").on("click", () => clearBoard());
	$("#save").on("click", () => saveGame());
	$("#previous").on("click", () => showPreviousGames());
}

// Gameplay Functions

function player() {
	if((window.turn % 2) === 1) {
		return "O";
	} else {
		return "X";
	}
}

function updateState(square) {
	let current_player = player();
	if(!checkWinner() && !checkTie()) {
		if(square.innerHTML === "") {
		square.innerHTML = current_player;
		return true;
		}
	}
	return false;
}

function setMessage(string) {
	let messages = $("#message");
	messages.text(string);
}

function checkWinner() {
	let winner = false;
	let board = getBoard();

	WINNING_COMBOS.some(function(winning_combo) {
		if(board[winning_combo[0]] !== "" && board[winning_combo[0]] === board[winning_combo[1]] && board[winning_combo[2]] === board[winning_combo[1]]) {
			setMessage("Player " + board[winning_combo[0]] + " Won!")
			winner = true;
		}
	});

	return winner;
}

function getBoard() {
	let board = [];

	$('td').text(function(index, value) {
		board.push(value);
	});

	return board;
}

function checkTie() {
	if(window.turn === 9) {
		setMessage("Tie game.");
		return true;
	}
	return false;
}

function doTurn(cell) {
	if(updateState(cell)) {
		window.turn += 1;
		if(checkWinner() || checkTie()) {
			saveGame();
			clearBoard();
		}
	}
}

function clearBoard() {
	$("#message").empty();
	window.turn = 0;
	$("td").empty();
	current_game = 0;
}

// AJAX functions

function saveGame() {
 	let board = getBoard();
 	let values = {state: board}

 	if(current_game === 0) {
 		$.post('/games', values, function(game) {
      	current_game = game.data.id;
      	$('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      	$("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
 	} else {
 		$.ajax({url: "/games/" + current_game, data: values, method: "PATCH"});
 	}
}

function reloadGame(gameId) {
	$("#message").empty();
	let cells = $("td");
	$.get(("/games/" + gameId), function(game) {
		current_game = game.data.id;
		for (let i = 0; i < cells.length; i++) {
			cells[i].innerHTML = game.data.attributes.state[i];
			if(game.data.attributes.state[i] === "X" || "O" === game.data.attributes.state[i]) {
				window.turn += 1;
			}
		}
	});
}

function showPreviousGames() {
	$("#games").empty();
  	$.get('/games', function(games) {
    	if (games.data.length) {
      		games.data.forEach(function(game) {
      			$('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  				$(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
      		});
    	}
  	});
}
