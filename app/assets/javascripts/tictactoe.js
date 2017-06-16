var turn = 0;
var currentGame = 0;

var win_combos = [
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  [[0,0],[0,1],[0,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[2,1],[2,2]],
  [[0,0],[1,1],[2,2]],
  [[2,0],[1,1],[0,2]]
  ];

$(function(){
	attachListeners();
});

function attachListeners() {
	$("td").on("click", function() {
		var y = $(this).data("y");
		var x = $(this).data("x");
		doTurn(x, y);
	});

	$("#previous").on("click", function() {
		getGames();
	});

	$("#save").on("click", function() {
		saveBoard(false);
	});
};

function clearBoard() {
	$("games").empty();
}

function getGames() {
	$.ajax({
		method: 'get',
		url: '/games'
	})
	.done(function(resp) {
		var savedGames = resp["games"];
		clearBoard();
		if (savedGames.length > 0){
			var list = $("#games").append('<ul></ul>').find('ul');
			savedGames.forEach(function(game){
				list.append('<li id="' + game["id"] + '">' + game["id"] + "</li>")
			})
		}
	})
}

function doTurn(x, y) {
	updateState(x, y);
	turn++;
	checkWinner();
};

function player() {
	var player = turn % 2 === 0 ? 'X' : 'O';
	return player;
};

function updateState(x, y){
	var space = $('td[data-x="' + x + '"][data-y="' + y + '"]');
	space.append(player());
};

function checkWinner() {
	if (turn > 3) {
		win_combos.forEach(function(combo){
			var row = $('td[data-x="' + combo[0][0] + '"][data-y="' + combo[0][1] + '"]').text() + $('td[data-x="' + combo[1][0] + '"][data-y="' + combo[1][1] + '"]').text() + $('td[data-x="' + combo[2][0] + '"][data-y="' + combo[2][1] + '"]').text();

			if (row === 'XXX' || row === 'OOO') {
				message(`Player ${row[0]} Won!`);
				saveBoard(true);
				reset();
				return;
			}
		});

		if (turn > 8) {
		message('Tie game');
		saveBoard(true);
		reset();
		}
	} 
	return false;
};

function message(string) {
	$('div#message').text(string);
};

function reset() {
	$('td').empty();
	turn = 0;
	currentGame = 0;
}

function currentBoardCells() {
	var board = [];
	$('td').each(function() { 
		board.push($(this).text());
	})
	return board;
}

function saveBoard(gameOver){
	var method = 'post';
	var url = '/games';

	if (currentGame > 0) {
		method = 'patch';
		url = url + '/' + currentGame;
	}

	$.ajax({
		method: method,
		url: url,
		data: { game: { state: currentBoardCells() } }
	}).done(function(res){
			if (gameOver) {
				currentGame = 0;
			} else {
			currentGame = res["game"]["id"];
		}
	})
}