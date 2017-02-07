var currentGame;
var turn = 0;
var boardState;
var cellNumber;
var cell;
// var win_combos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 7], [0, 3, 6], [1, 4, 7], [2, 5, 8]]
function attachListeners(){
	$('table').click(function(event){
		doTurn(event);
	})
}

$(document).ready(function(){
	$.post('/games');
	attachListeners();
	$.get("/games", function(data){
		currentGame = (parseInt($(data).filter('#current_game_id')["0"].innerHTML));
	})
})


function updateState(event){
	$(event.target).text(player());
	cell = $(event.target).data();
	if(cell["x"] === 0){
		if(cell["y"] === 0){
			cellNumber = 0;
		}
		if(cell["y"] === 1){
			cellNumber = 1;
		}
		if(cell["y"] === 2){
			cellNumber = 2;
		}
	}else if(cell["x"] === 1){
		if(cell["y"] === 0){
			cellNumber = 3;
		}
		if(cell["y"] === 1){
			cellNumber = 4;
		}
		if(cell["y"] === 2){
			cellNumber = 5;
		}
	}else if(cell["x"] === 2){
		if(cell["y"] === 0){
			cellNumber = 6;
		}
		if(cell["y"] === 1){
			cellNumber = 7;
		}
		if(cell["y"] === 2){
			cellNumber = 8;
		}
	}
	//get current board
	boardState = $('table > tbody > tr > td').map(function(index, element){
		return element.innerText;
	})

	
		$.ajax({
			type: "PUT",
			url: '/games/' + currentGame,
			data: {state: boardState.toArray()}
		})
		// $.post('/games/#{parseInt($("input").val())}', {id: parseInt($("input").val()), cellNumber: cellNumber, player: player()})
}

function message(msg){
	$("#message").text(msg);
}

function checkWinner(){
	// array = $('table > tbody > tr > td').map(function(index, element){
	// 	return element.innerText;
	// })
	// array.every(x => x === "")
	// var msg;
	// win_combos.forEach(function(element){
	// var combo = element.map(function(item){
	// 		return board[item];
	// 	})
	// if(combo.every(x => x === "X")){
	// 	msg = "Player X Won!";
	// }else if(combo.every(x => x === "O")){
	// 	msg = "Player O Won!";
	// }
	// });
	// message(msg);
}

function player(){
	if(turn % 2 === 0){
		return "X"
	}else{
		return "O"
	}
}

function doTurn(event){
	checkWinner();
	updateState(event);
	return turn = turn + 1;
}

