// Board:
// 00 10 20
// 01 11 21
// 02 12 22

var turn = 0
var game;

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

function attachListeners() {
	$('tbody').click(function(event) {
		doTurn(event);
	});
	$('#games').click(function(event) {
		showGames(event);
	});
	$('#save').click(function(event) {
		saveGame(event);
	});
	$('#previous').click(function(event) {
		previousGame(event);
	});
};

function doTurn(event) {
	updateState(event);
	if (checkWinner() || tieGame()) {
		saveGame();
		$('td').html('');
		turn = 0;
		game = 0;
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

function showGames() {
	$.getJSON('/games').done(function(response) {
		var games = response.games
		var gameList = $()
		games.forEach(function(game) {
			gameList = gameList.add($('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id}));
		});
		$('#games').html(gameList);
	});
};

function saveGame() {

};

function previousGame() {

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

$(function() {
	attachListeners();
});

// winCombos = 
// winCombo = winCombos[0], etc.
// winPositions = winCombo[0] winCombo[1]

// [ [ [0,0],[1,0],[2,0] ] ]
// winCombos
// winCombos[0] = winCombo
// winCombos[0][0] = winCombo[0] = winPositions
// winCombos[0][0][0] = winCombo[0][0] = winPositions[0]