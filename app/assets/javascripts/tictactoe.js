var turn = 0;
var currentGame = 0;

var winningCombos = [
						[0, 1, 2],
						[3, 4, 5],
						[6, 7, 8],
						[0, 3, 6],
						[1, 4, 7],
						[2, 5, 8],
						[0, 4, 8],
						[2, 4, 6]
					]

function getGame() {
	var cells = $('td')
	var board_array = []
	$.each(cells, function(index, value) {
		board_array.push(value.innerHTML)
	})
	return board_array
}

function player() {
	return (turn % 2 == 0) ? "X" : "O"
}

function resetBoard () {
	turn = 0;
	currentGame = 0;
	var cells = $('td');
	$.each(cells, function(index, value) {
		value.innerHTML = ""
	})
}

function message(message) {
	$('#message').text(message)
}

function saveGame(){
	var obj = {};
	obj["game"] = {}
	obj["game"]["state"] = getGame();
	
	$.ajax({
		type: "POST",
		url: "/games",
		data: obj,
		success: function(response) {
			currentGame = response.game.id
		}
	})
}

function updateGame () {
	var obj = {}
	obj["game"] = {}
	obj["game"]["state"] = getGame();
	$.ajax( {
		url: "/games/" + currentGame,
		data: obj,
		type: "PATCH"
	})
}


function superSave () {
	if (currentGame == 0) {
		saveGame();
	} else {
		updateGame();
	}
}


function attachListeners() {
	$('td').click(function(e){
		e.stopPropagation();
		doTurn(e);
	})

	$('#save').click(function(e){
		superSave();
	})

	$('#previous').click(function(e){
		$.get('/games', function(response){
			$('#games').html("")
			$.each(response["games"], function(index, value) {
				//CODE TO ACTUALLY GIVE YOU GOOD LINKS   HERE
				$('#games').append("<a href='#' class='link' data-id=" + value["id"] +">Game " + value["id"] + "</p>")
			})
			addLinkHandlers();
		})
	})
}

function addLinkHandlers() {
	$('.link').click(function(e){
		var game_id = $(this).data("id")
		var getting = $.get("/game/" + game_id + "/load")
		getting.done(function(data){
			currentGame = data["game"]["id"]
			$.each($('td'), function(index, value){
				value.innerHTML = data["game"]["state"][index]
			})
			var strippedArray = data["game"]["state"].filter(function(n) { return n != ""})
			turn = strippedArray.length
		})
	})
}

function doTurn(e) {
	updateState(e);
	var over = checkWinner();
	if (turn == 8 && !checkWinner()) {
		message('Tie game')
		superSave();
		resetBoard();
	} else {
		if (!over) {
			turn++;
		}
	}
}

function checkWinner() {
	var current_board = getGame();
	var answer = false
 	$.each(winningCombos, function(index, value) {
 	if ( (current_board[value[0]] == "X" && current_board[value[1]] == "X" && current_board[value[2]] == "X") ||
 		 (current_board[value[0]] == "O" && current_board[value[1]] == "O" && current_board[value[2]] == "O") ) {
 		var winning_token = current_board[value[0]]
 		message('Player ' + winning_token + ' Won!');
 		superSave();
 		resetBoard();
 		answer = true
 	}
 })
 currentGame = 0;
 return answer
}

function updateState(event) {
	event.currentTarget.innerHTML = player();
}

$(function(){
	attachListeners();
})