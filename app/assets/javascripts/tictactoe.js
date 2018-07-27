var rowIndex = ""
var cellIndex = ""
var currentGame;
var gameHold = "n";

var turn = 0;

$(function() {
	attachListeners();
})

var player = function() {	
	if(turn % 2 === 0) {	
		return "X"
	} else {
		return "O"
	}
}

function updateState(event) {
	// var td = event.target
	// player();
	// changeContent(player())
	if(currentGame == undefined) {
		
		$(event).text(player())
	} else {
		for(var i = 0; i < 9; i++) {
			if(event[i] !== undefined) {
				document.querySelectorAll("td")[i].innerHTML = event[i];
			}
		}
		gameHold = currentGame;
		currentGame = undefined;
	}
	
}

function doTurn(event) {
	
	updateState(event)
	turn++;
	if(checkWinner() === true) {
		saveGame();
		clearBoard();
	}
}

function attachListeners() {
	$("td").on("click", function(event) {	

    	if(event.target.innerHTML === "" && !checkWinner()) {
    		doTurn(event.target);
    	}
		
	})
	$("#clear").on("click", function() {
		clearBoard();
	})
	$("#save").on("click", function() {
		saveGame();
	})
	$("#previous").on("click", function() {
		previousGames();
	})

}


function setMessage(str) {

	$("#message").text(str);
}

function checkWinner() {
	var arr = $("td").map(function() {
    	return $(this).html()
  		}).toArray();

	if(arr[0] != "" && arr[0] === arr[1] && arr[1] === arr[2]) {
		setMessage(`Player ${arr[0]} Won!`)
		return true;
	} else if(arr[3] != "" && arr[3] === arr[4] && arr[4] === arr[5]) {
		setMessage(`Player ${arr[3]} Won!`)
		return true;
	} else if(arr[6] != "" && arr[6] === arr[7] && arr[7] === arr[8]) {
		setMessage(`Player ${arr[6]} Won!`)
		return true;
	} else if(arr[0] != "" && arr[0] === arr[4] && arr[4] === arr[8]) {
		setMessage(`Player ${arr[0]} Won!`)
		return true;
	} else if(arr[2] != "" && arr[2] === arr[4] && arr[4] === arr[6]) {
		setMessage(`Player ${arr[2]} Won!`)
		return true;
	} else if(arr[0] != "" && arr[0] === arr[3] && arr[3] === arr[6]) {
		setMessage(`Player ${arr[0]} Won!`)
		return true;
	} else if(arr[1] != "" && arr[1] === arr[4] && arr[4] === arr[7]) {
		setMessage(`Player ${arr[1]} Won!`)
		return true;
	} else if(arr[2] != "" && arr[2] === arr[5] && arr[5] === arr[8]) {
		setMessage(`Player ${arr[2]} Won!`)
		return true;
	} else if(turn === 9) {
		setMessage("Tie game.")
		return true;
	} else {
		return false;
	}
}



function clearBoard() {
	
	gameHold = "n"
	turn = 0;
	$("td").each(function() {
		$(this).html("");
	})
}

function saveGame() {
	
	var arr = $("td").map(function() {
    	return $(this).html()
  		}).toArray();
	gameData = {state: arr}

	if(gameHold === "n") {
		var posting = $.post('/games', gameData);
		posting.done(function(json) {
			console.log(json)
			gameHold = json.data.id
		})	
	} else {
		debugger;
		$.ajax({
			type: 'PATCH',
			url: `/games/${gameHold}`,
			data: gameData
		})
	}
}

function previousGames() {
	$("#games").empty();
	  $.get('/games', function(data){

	    var games = data.data;
	    if (games.length > 0){
	      games.forEach(function(game){
	       $("#games").append(`<button id="gameId-${game.id}" onclick="getGame(${game.id})">${game.id}</button><br>`);

	      });
	     
	    }
	  });		
}

function getGame(event) {
	
	 currentGame = event;
	$.get(`/games/${event}`, function(data) {
		turn = data.data.attributes.state.join("").length;
		updateState(data.data.attributes.state);
	})	
}



