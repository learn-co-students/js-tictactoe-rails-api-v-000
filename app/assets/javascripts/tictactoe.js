var turn = 0;
var board;
var winCombinations = [ [0,1,2],[3,4,5],
												[6,7,8],[2,5,8],
												[0,3,6],[1,4,7],
												[0,4,8],[6,4,2] ];

$(function() {
	attachListeners();
})



function attachListeners() {
	$('td').click(function() {
		var selector = this;
		var x = $(this).data('x');
		var y = $(this).data('y');
		if ($(selector).html() === "") {
			doTurn(selector);
		}
	});

	$('.previous').click(function() {
		getAllGames();
	})


}

function doTurn(selector) {
	updateState(selector);
	board = $('td').map(function(n) { return $('td:eq('+n+')').html() });
	if (checkWinner()) {
		return resetGame();
	};
	turn += 1;
}


function checkWinner() {
	var won = [];
	winCombinations.forEach(function(win) {
		if ((board[win[0]] === board[win[1]]) &&
				(board[win[1]] === board[win[2]]) && 
				(board[win[2]] === board[win[0]]) && 
			 	 board[win[0]] !== "") {
			won.push(win);
		}
	});
	if ((won.length !== 0) && !isFull()) {
		message("Player " + player() + " Won!");
	 	return true; 
	} else if (isFull()) {
		message("Tie game");
	  return true;
	} else {
		return false;
	};
}

function updateState(selector) {
	$(selector).text(player);
}

function player() {
	return turn & 1 ? "O" : "X";
}

function message(sentence) {
	$('#message').html(sentence);
}

function isFull() {
	return $.makeArray(board).indexOf("") === -1 ? true : false;
}

function resetGame() {
	$('td').each(function(n) { $('td:eq('+n+')').html("") });
	turn = 0;
}

function getAllGames() {
	$.get('/games', function(data) {
		debeugger;
	});
}





