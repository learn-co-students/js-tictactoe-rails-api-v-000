var turn = 0;
var game_saved = false;
var brd = ["X","","","","","","","",""]

function attachListeners(){
	$( "td" ).click(function() {
	  doTurn(this);
	});
	$("#previous").click(function(){
		getAllGames();
	});
	$("#save").click(function(){
		saveGame();
	});
}

// function turn(){

// }

function getAllGames(){
	console.log("I am in getAllGames");
	$.ajax({url: "/games", success: function(result){
        console.log(result);
        //$("#games").html(result);
        result.games.forEach(function(game) {
		    console.log(game);
		    $('#games').append(game.id+'<br>')
		});
    }});
}

function saveGame(){
	if(game_saved == false){
		var values = {
	        'game': {
	          'state': boardState()
	        }
	      }
	    $.post('/games', values)
		    .done(function( data ) {
			    console.log(data.id);
			    game_saved = true;
			    gameID = data.id;
		});
    } else {
    	var data = {
	        'game': {
	          'state': boardState()
	        }
	      }
	    $.ajax({
		    url : '/games/'+gameID,
		    data : data,
		    type : 'PATCH',
		    success: function(result){
        		console.log(result);
        	}
		    //contentType : 'application/json'
		})
    }
}

function currentGame(){

}

function doTurn(state){
	updateState(state);
	//checkWinner();
	if(checkWinner()==true){
		saveGame();
		resetGame();
	}
	turn++;
}

function resetGame(){
	turn = -1
	$('td').empty();
	game_saved = false;
	//$('#message').empty();
}

function player(){
	if (turn % 2 != 0){
		return 'O';
	}
	return 'X';
}

function message(string){
	$("#message").html(string);
}

function boardState(){
	var positionArray = $("td").map(function() {
    	return $(this).text();
    });
    return $.makeArray(positionArray);
}

function updateState(bla){
	console.log('updateState');
    $(bla).append(player());
}

function checkWinner(){
	is_the_game_over = false;
    var board = boardState();
	var winningCombos = ['012', '345', '678', '036', '147',
	 '258', '048', '246'];
	winningCombos.forEach(function(combo) {
    	combo = combo.split('');
    	if (board[parseInt(combo[0])]==player() && 
    		board[parseInt(combo[1])]==player() && 
    		board[parseInt(combo[2])]==player()){
			message("Player "+player()+" Won!");
			is_the_game_over = true;
		}
		if(turn == 8 && is_the_game_over == false){
			message("Tie game");
			is_the_game_over = true;
		}
	}); 
	return is_the_game_over;
}