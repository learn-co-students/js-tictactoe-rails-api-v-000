// Code your JavaScript / jQuery solution here
var turn = 0;

function player() {
	if (turn % 2 == 0) {
		return 'X'
	} else {
		return 'O'
	}
}

function updateState(td) {
	td.innerHTML = player();
}

function setMessage(message) {
	$('#message').text(message)
}

function checkWinner() {
	var board = tableAsArray();
	var win_combos = [[0,1,2],[3,4,5],[6,7,8], [0,3,6],[1,4,7],[2,5,8], [0,4,8],[2,4,6]];
	var winner = '';
	var gamewon = win_combos.some(function(combo){
		winner = board[combo[0]];
		return (board[combo[0]] != '' && board[combo[0]] == board[combo[1]] && board[combo[1]] == board[combo[2]])
	});
	if (gamewon) {
		setMessage('Player ' + winner + ' Won!');
		return true
	}
	return false
}

function checkTie() {
	if (turn == 8) {
		return true;
	}
	return false
}

function doTurn(td) {
	var gameOver = false;
	if (checkWinner()) {
		gameOver = true;
	}
	if (td.innerHTML != "X" && td.innerHTML != 'O' && !gameOver) {
		updateState(td);
		if (checkTie()) {
			setMessage('Tie game.')
			gameOver = true;
		}
		if (!gameOver) {
			turn++
		} else {
			saveGame();
			turn = 0;
			$('td').text("");
			$('table').data('game-id', "");
		}
	}
}

function tableAsArray() {
	var array = [];
	$('td').each(function(i){
		array[i] = $(this).text();
	});
	return array;
}

function updateTableDom(array) {
	$('td').each(function(i){
		$(this).text(array[i]);
	});
}

function newGame() {
	$('table').data('game-id', "");
	$('td').text("");
	turn = 0;
}

function saveGame(){
	var gameID = $('table').data('game-id');
	if (gameID) {
	  $.ajax({
	    url: '/games/' + gameID,
	    type: 'PATCH',
	    data: {state: tableAsArray()},
	    success: function(response){
				$('table').data('game-id', response["data"]["id"])
			}
    });
	} else {
		$.post('/games', {state: tableAsArray()}).done(function(response){
			$('table').data('game-id', response["data"]["id"])
		})
	}
}

function attachListeners() {
	$("td").on("click", function(){
		doTurn($(this).get()[0]);
	});

	$("#save").on("click", saveGame);

	$("#previous").on("click", function(){
		$.get('/games', function(response){
			var games = response["data"];
			var last_saved= Number($('#games li:last-child').text()) || -1;
			var ul = '<ul id="gamesUl">';
			for (var i = 0; i < games.length; i++) {
				if (last_saved < Number(games[i]["id"]))
					ul += '<li>' + games[i]["id"] + '</li>';
			}
			ul += '</ul>'
			if (games.length > 0) {
				$("#games").append(ul);

				$('#gamesUl li').on('click', function(){
					var id = this.innerHTML;
					$.get('/games/' + id, function(data){
						$('table').data('game-id', id);
						updateTableDom(data["data"]["attributes"]["state"])
					});
				});
			}
		});
	});

	$("#clear").on("click", newGame);	

}

$(function(){
	attachListeners();
});

