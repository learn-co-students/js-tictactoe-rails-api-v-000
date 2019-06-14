// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;

const WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
  ];

$(document).ready(function() {
  attachListeners();
});

function player() {
	if(turn % 2 === 0) {
		return 'X';
	} else {
		return 'O';
	}
}

function updateState(position) {
	$(position).text(player());
}

function setMessage(msg) {
	$('#message').text(msg);
}

function checkWinner() {
	var board = {};
	var winner = false;
	$('td').text((index, position) => board[index] = position);

	WIN_COMBINATIONS.some(function(combo) {
		if(board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
			setMessage(`Player ${board[combo[0]]} Won!`);
			return winner = true;
		}
	})
	return winner;
}

function doTurn(position) {
	updateState(position);
	turn++;

	if(checkWinner()) {
		saveGame();
		resetBoard();
	} else if (turn === 9) {
		setMessage('Tie game.');
		saveGame();
		resetBoard();
	}
}

function attachListeners() {
	$('td').on('click', function() {
    	if (!$.text(this) && !checkWinner()) {
      		doTurn(this);
    	}
  	});

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

function saveGame() {
	var currentState = [];
	var gameData;

	$('td').text((index, position) => {
		currentState.push(position);
	});
	gameData = {state: currentState};

	if(currentGame) {
		$.ajax({
	      type: 'PATCH',
	      url: `/games/${currentGame}`,
	      data: gameData
	    });
	} else {
		$.post('/games', gameData, function(game) {
			currentGame = game.data.id;
			$("#games").append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
			$(`#gameid-${game.data.id}`).on('click', () => reloadGame(game.data.id));
		})
	}

}

function resetBoard() {
	$('td').empty();
	turn = 0;
	currentGame = 0;
}

function showPreviousGames() {
	$("#games").empty();
	$.get("/games", function(games) {
      if (games.data.length) {
      	games.data.forEach(function(game) {
      		$("#games").append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      		$(`#gameid-${game.data.id}`).on('click', () => reloadGame(game.data.id));
      	})
      }
    });
  }

function reloadGame() {

}