// Board:
// 00 10 20
// 01 11 21
// 02 12 22

// winCombos = 
// winCombo = winCombos[0], etc.
// winPositions = winCombo[0] winCombo[1]

// [ [ [0,0],[1,0],[2,0] ] ]
// winCombos
// winCombos[0] = winCombo
// winCombos[0][0] = winCombo[0] = winPositions
// winCombos[0][0][0] = winCombo[0][0] = winPositions[0]

var turn = 0;
var currentGame;

const winCombos = [
	[
		[0,0],
		[1,0],
		[2,0],
	],
	[
		[0,1],
		[1,1],
		[2,1],
	],
	[
		[0,2],
		[1,2],
		[2,2],
	],
	[
		[0,0],
		[0,1],
		[0,2],
	],
	[
		[1,0],
		[1,1],
		[1,2],
	],
	[
		[2,0],
		[2,1],
		[2,2],
	],
	[
		[0,0],
		[1,1],
		[2,2],
	],
	[
		[2,0],
		[1,1],
		[0,2],
	],
];

function doTurn(event) {
	updateState(event);
	if (checkWinner() || tieGame()) {
		saveGame(true);
		$('td').html('');
		turn = 0;
		currentGame = 0;
	} else {
		turn += 1;
	};
};

function player() {
	if (turn % 2 === 0) {
		return 'X';
	} else {
		return 'O';
	};
};

function updateState(event) {
	$(event.target).html(player());
};

function getGameBoard() {
	var board = [];
	$('td').each(function(i) {
		board.push($(this).text())
	});
	return board;
};

function loadGameBoard(board) {
	$('td').each(function(i) {
		$(this).text(board[i]);
	});
};

function saveGame(reset) {
	var path;
	var method;
	if (currentGame) {
		path = '/games/' + currentGame;
		method = 'PATCH';
	} else {
		path = '/games';
		method = 'POST';
	};

	$.ajax({
		url: path,
		method: method,
		dataType: 'json',
		data: {
			game: {
				state: getGameBoard()
			}
		}
	})
	.success(function(data) {
		if (reset) {
			currentGame = undefined;
		} else {
			currentGame = data.game.id;
		}
	})
	.error(function(data) {
		console.log("Error")
	})
};

function previousGames() {
	$.ajax({
		url: '/games',
		method: 'GET',
		dataType: 'json',
	})
	.success(function(data) {
		showGames(data.games);
		console.log("Success")
	})
	.error(function(data) {
		console.log("Error")
	})
	// $.getJSON('/games').done(function(response) {
	// 	debugger
	// 	showGames(response.games);
	// 	console.log(response);
	// });
};

function showGames(games) {
	var gameList = $()
	games.forEach(function(game) {
		gameList = gameList.add($('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id}));
	});
	$('#games').html(gameList);
};

function changeGame(board, id) {
	currentGame = id;
	loadGameBoard(board);
	turn = rememberPlayer(board);
};

function rememberPlayer(board) {
	var turn = 0;
	board.forEach(function(cell) {
		if (cell != '') {
			turn += 1;
		};
	});
	return turn;
};

function tieGame() {
	var tie = true;
	$('td').each(function() {
		if ($(this).html().length <= 0) {
			tie = false;
		};
	});
	if (tie === true) {
		message('Tie game');
		return tie;
	};
};

function lookForWinner(winCombo) {
	for (let i = 0; i < winCombo.length; i++) {
		var winPositions = winCombo[i];
		var x = winPositions[0];
		var y = winPositions[1];
		var cell = $('[data-x="' + x + '"][data-y="' + y + '"]');
		if (cell.html() != player()) {
			return false;
		};
	};
	return true;
};

function checkWinner() {
	for (let i = 0; i < winCombos.length; i++) {
		var winCombo = winCombos[i];
		if(lookForWinner(winCombo) === true) {
			message('Player ' + player() + ' Won!');
			return true;
		};
	};
	return false;
};

function message(string) {
	$('#message').text(string);
};

function attachListeners() {
	$('tbody').click(function(event) {
		doTurn(event);
	});
	$('#games').click(function(event) {
		var board = $(event.target).data('state').split(',');
	  changeGame(board, $(event.target).data('gameId'));
	});
	$('#save').click(function() {
		saveGame();
	});
	$('#previous').click(function() {
		previousGames();
	});
};

$(function() {
	attachListeners();
});