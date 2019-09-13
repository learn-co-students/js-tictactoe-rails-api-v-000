// Code your JavaScript / jQuery solution here
var turn = 0;

//Great memoization but breaks the test
// var memos = {}

// function memoize(game) {
// 	memos[game["id"]] = {state: game["attributes"]["state"]}
// }

// function retreaveMemo(id) {
// 	$('table').data('game-id', id);
// 	updateTableDom(memos[id].state);
// 	calculateTurn();
// }

function doTurn(td) {
	var gameOver = false;

	if (updateState(td)) {
	
		if (checkWinner()) {
			gameOver = true;
		} else if (checkTie()) {
			gameOver = true;
		}
	
		if (!gameOver) {
			turn++
		} else {
			saveGame();
			newGame();
		}
	
	}
}

function newGame() {
	$('table').data('game-id', "");
	$('td').text("");
	turn = 0;
}

function calculateTurn() {
	var arr = tableAsArray();
	var xs = arr.filter((e)=> e == 'X')
	var os = arr.filter((e)=> e == 'O')

	turn = xs.length + os.length;

	if (!checkWinner() && !checkTie()) {
		setMessage("");
	}
}

function player() {
	if (turn % 2 == 0) {
		return 'X'
	} else {
		return 'O'
	}
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
	if (turn >= 8) {
		setMessage('Tie game.')
		return true;
	}
	return false
}

function moveIsInvalid() {
	var board = tableAsArray();
	var win_combos = [[0,1,2],[3,4,5],[6,7,8], [0,3,6],[1,4,7],[2,5,8], [0,4,8],[2,4,6]];
	return win_combos.some(function(combo){
		winner = board[combo[0]];
		return (board[combo[0]] != '' && board[combo[0]] == board[combo[1]] && board[combo[1]] == board[combo[2]])
	}) || turn == 9;
}

function updateState(td) {
	if (td.innerHTML != "") {
		return false
	} else {
		td.innerHTML = player(); 
		return true
	}
}

function setMessage(message) {
	$('#message').text(message)
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
		if (moveIsInvalid()) return;
		doTurn($(this).get()[0]);
	});

	$("#save").on("click", saveGame);

	$("#previous").on("click", function(){
		$.get('/games', function(response){
			var games = response["data"];
			var last_saved = Number($('#games button').last().data('id')) || -1;

			for (var i = 0; i < games.length; i++) {
				if (last_saved < Number(games[i]["id"])) {
					// memoize(games[i]);
					$('#games').append('<button data-id=' + games[i]["id"] + '>' + games[i]["id"] + '. created at: ' + games[i]["attributes"]["created-at"] + '</button><br>');
				}
			}

			$('#games button').on('click', function(){
				var id = $(this).data('id');
				// if (memos[id]) {
				// 	retreaveMemo(id)
				// } else {
					$.get('/games/' + id, function(data) {
						$('table').data('game-id', id);
						updateTableDom(data["data"]["attributes"]["state"]);
						calculateTurn();
					});
				// }
			});
		});

	});

	$("#clear").on("click", newGame);	

}

$(function(){
	$('table').data('game-id', "")
	attachListeners();
});