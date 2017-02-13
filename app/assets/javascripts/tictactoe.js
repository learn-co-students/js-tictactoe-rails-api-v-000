var currentGame = 0;
var turn = 0;
var boardState = ["", "", "", "", "", "", "", "", ""];
var cellNumber;
var winCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6], [0, 3, 6], [1, 4, 7], [2, 5, 8]]
var variable;

$(document).ready(function(){
	turn = 0;
	attachListeners();
})

function saveGame(callback){
		console.log('currentgame: ' + currentGame);
		if (currentGame === 0){
			$.post('/games', {state: boardState}, function(response){
				currentGame = response["game"]["id"];
				console.log('currentgame: ' + currentGame);
				if ($('#games').children().length != 0){
					$('#games').append('<li>' + currentGame + '</li>')
				}
				callback(response);
			});
			
		}else{
			var url = '/games/' + currentGame
			$.ajax({
				type: "PATCH",
				url: url,
				data: {id: currentGame, game: {state: boardState}}
			});
		}
}

function attachListeners(){
	//listeners for the table cells
	$('table').click(function(event){
		doTurn(event);
	})

	//listener for save button
	$('#save').click(function(event){
		saveGame(function(response) {
			currentGame = response["game"]["id"]
		});
		
	});

	//listener for get previous games button
	$("#previous").click(function(event){
		$.get('/games', function(callback){
			var data = callback["games"].map(function(element){
				// $('#games').append('<li>' + element["id"] + '</li>')
				return '<li>' + element["id"] + '</li>'
			})
			$('#games').html(data)
		})
		
	})
	
	$('#games').click(function(event){
		currentGame = event.target.textContent;
		$.get('/games', function(data){
			state = data["games"][currentGame]["state"]
			state.forEach(function(element, index){
				$('table > tbody > tr > td')[index].innerText = element;
			})
		})
	})
	
}


function updateState(event){
	$(event.target).text(player());
	//get current board
	boardState = $('table > tbody > tr > td').map(function(index, element){
		return element.innerText;
	})
	boardState = boardState.toArray();	
}

function message(msg){
	$("#message").text(msg);
}

function resetBoard(){
	$('table > tbody > tr > td').empty();
	turn = 0;
	console.log('currentgame: ' + currentGame)
	// below is a function to clear message, but it makes the tests fail
	// $('table').click(function(){
	// 	$('#message').replaceWith('<div id="message"><div>');
	// });
}	

function checkWinner(){
	//check for winning combinations
	winCombos.forEach(function(element){
		combo = element.map(function(item){
			return boardState[item];
		});
		if (combo.every(x => x === "X")){
			saveGame(function() {
				currentGame = 0;
			});
			resetBoard();
			message("Player X Won!");

		}else if (combo.every(x => x === "O")){
			saveGame(function() {
				currentGame = 0;
			});	
			resetBoard();
			message("Player O Won!");
		}
	});
	//check if the game if there is a tie
	if (turn === 9){
		saveGame(function() {
				currentGame = 0;
			});	
		resetBoard();
		message("Tie game");
	}else{
		return false;
	}
	
}

function player(){
	if( turn % 2 == 0 || turn === 0){
		return "X"
	}else if ( turn % 2 != 0 ){
		return "O"
	}
}

function doTurn(event){
	updateState(event);
	turn = turn + 1;
	checkWinner();
}


