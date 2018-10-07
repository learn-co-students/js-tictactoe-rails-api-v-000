// Code your JavaScript / jQuery solution here
var turn = 0;
var token = player();
var currentGame = 0;
WIN_COMBINATIONS = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ]

$(document).ready(function() {
	attachListeners();
});

function player() {
	if (turn % 2 === 0){return "X"}
	else {return "O"};
};

function updateState(space) {
	$(space).text(player());
};

function doTurn(space) {
		updateState(space);
		turn++;

	if (checkWinner()) {
		saveGame();
		resetBoard();
	};
	if (turn === 9) {
		setMessage("Tie game.");
		saveGame();
		resetBoard();
	};
};

function checkWinner() {
	let board = {};
	let winner = false;
	$('td').text(function(index, space) {
		board[index] = space;
	});
	WIN_COMBINATIONS.forEach(function(combo) {
		if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]){
		setMessage(`Player ${board[combo[0]]} Won!`);
		return winner = true;
		}
	});
	return winner;
};
	
function resetBoard() {
	$('td').empty();
	turn = 0;
	currentGame = 0;
};


function setMessage(string) {
	$('#message').text(string);
};

function saveGame() {
	var state = [];
	var gameData;

	$('td').text((index, space) => {
		state.push(space);
	});

	gameData = { state: state };

	if (currentGame){
		$.ajax({
			method: 'PATCH',
			url: `/games/${currentGame}`,
			data: gameData
		});
	} else {
		$.post('/games', gameData, function(game){
			currentGame = game.data.id;
			$('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
			$("#gameid-" + game.data.id).on('click', () =>
				reloadGame(game.data.id));
			});
		};
	};


function attachListeners() {
	$("td").on("click", function() {
		if (!checkWinner() && !$.text(this)) {
			doTurn(this);
		};
	});

	$("#previous").on("click", previousGames);
	$("#clear").on("click", resetBoard);
	$("#save").on("click", saveGame);
};

function previousGames() {
	$("#games").empty();
	$.get('/games', (game) => {
		game.data.forEach(function(game) {
			$('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
				$(`#gameid-${game.id}`).on("click", () => loadGame(game.id));
		});
	});
};



function loadGame(id) {
	currentGame = id
	$.get(`/games/${id}`, function(game) {
		board = game.data.attributes["state"];
		for(i=0; i < board.length; i++) {
			$('td')[i].innerHTML = board[i]
			turn = board.filter(String).length
		};
	});
};




