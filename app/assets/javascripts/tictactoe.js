var turn = 0;
var winningCombinations = [ [ [0, 0], [0, 1], [0, 2] ], [ [1, 0], [1, 1], [1, 2] ], [ [2, 0], [2, 1], [2, 2] ], [ [0, 0], [1, 0], [2, 0] ], [ [0, 1], [1, 1], [2, 1] ], [ [0, 2], [1, 2], [2, 2] ], [ [0, 0], [1, 1], [2, 2] ], [ [2, 0], [1, 1], [0, 2] ]  ];
var validTurn = true;
var currentGame;

function checkWinningCombinations() {
	var x;
	var y;
	for (i=0; i<winningCombinations.length; i ++) {

		winningCombination = winningCombinations[i];

		x = winningCombination[0][0];
		y = winningCombination[0][1];
		token1 = $('[data-x="' + x + '"][data-y="' + y + '"]').text();

		x = winningCombination[1][0];
		y = winningCombination[1][1];
		token2 = $('[data-x="' + x + '"][data-y="' + y + '"]').text();

		x = winningCombination[2][0];
		y = winningCombination[2][1];
		token3 = $('[data-x="' + x + '"][data-y="' + y + '"]').text();

		if ( token1 !== "" && token1 === token2 && token2 === token3 ) {
			return [true, token1];
		}
	}
	return [false, ""];
}

function checkTie() {
	var tie = true;
	$('td').each(function() {
		if ($(this).context.innerText === "") {
			tie = false;
			return;
		}
	});

	if (tie) {
		message("Tie game");
	}
	return tie;
}

function attachListeners() {
	onTdClick();
	onPreviousGamesButtonClick();
	onSaveGameButtonClick();
	onGameClick();
}

function onGameClick() {
	$('div#games').on("click", 'li.game', function(event){
		loadGame(event);
	});
}

function loadGame(event) {
	currentGame = event.currentTarget.dataset.id;
	var gameState = event.currentTarget.dataset.state.split(',');
	setBoardFromGameState(gameState);
}

function setBoardFromGameState(gameState) {
	$('td').each(function(index, element) {
		$(this).context.innerText = gameState[index];
	});
}

function onSaveGameButtonClick() {
	$('#save').on("click", function() {
		saveCurrentGame(false);
	})
}

function boardToGameState() {
	gameState = [];
	$('td').each(function() {
		gameState.push($(this).context.innerText);
	});
	return gameState;
}

function saveCurrentGame(resetGame) {

	if (currentGame) {
		url = "/games/" + currentGame
		method = "PATCH"
	} else {
		url = "/games"
		method = "POST"
	}

	$.ajax({
	    url: url,
	    method: method,
	    dataType: "json",
	    data: {
			game: {
				state: boardToGameState()
			}
	    },
	    success: function(data) {
	    	if (resetGame) {
	    		currentGame = undefined;
	    	} else {
	        	currentGame = data.game.id;
	    	}
	    }
	});
}

function onPreviousGamesButtonClick() {
	$('#previous').on("click", function() {
		$.get('/games', function(JSON) {
			renderGames(JSON.games);
		});
	});
}

function renderGames(games) {
	var gamesHtml = '';
	games.forEach(function(game) {
		gamesHtml += '<li class="game" data-id="' + game.id + '" data-state="' + game.state + '">' + game.id + '</li>';
	});
	$('#games').html(gamesHtml);
}

function doTurn(event) {
	updateState(event);
	if (validTurn) {
		if (checkWinner() || checkTie()) {
			saveCurrentGame(true);
			resetBoard();
			turn = 0;
		} else {
			turn += 1;
		}
	}
}

function resetBoard() {
	$('td').each(function() {
		$(this).context.innerText = "";
	});
}

function updateState(event) {
	var x = event.currentTarget.dataset.x
	var y = event.currentTarget.dataset.y
	if ( $('[data-x="' + x + '"][data-y="' + y + '"]').text() === "" ) {
		validTurn = true;
		$('[data-x="' + x + '"][data-y="' + y + '"]').text(player());
	} else {
		validTurn = false;
	}
}

function message(message) {
	$("#message").text(message)
}

function checkWinner() {
	winArray = checkWinningCombinations();
	if (winArray[0]) {
		message("Player " + winArray[1] + " Won!" )
		return true;
	}
	return false;
}

function player() {
	return turn % 2 === 0 ? "X" : "O"
}

function onTdClick() {
	$("td").on("click", function(event){
		doTurn(event);
	});
}

$(document).ready(function() {
	attachListeners();
});
