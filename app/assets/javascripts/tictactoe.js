var turn = 0;
var game_saved = false;
var gameID = -1

function attachListeners(){
	$( "td" ).click(function() {
	  doTurn(this);
	});
	$("#previous").click(function(){
		//saveGame();
		getAllGames();
	});
	$("#save").click(function(){
		saveGame();
	});
	$("a").click(function(){
		//alert($(this).attr('data-gameid'));
		loadSave($(this).attr('data-gameid'));
	});
}

function loadSave(id){
	$.ajax({
		url : '/games/'+id,
		success: function(data){
            console.log(data.game.state);
            savedBoard = data.game.state
            $('td').each(
            	function(index){ 
            		$(this).html(savedBoard[index])
            	}
			);
        }
	})
}

function getAllGames(){
	console.log("I am in getAllGames");
	$.ajax({url: "/games", success: function(result){
        console.log(result);
        $("#games").html("");
        result.games.forEach(function(game) {
		    $('#games').append(
		    	'<a href=# data-gameid='+game.id+'>'+game.id+'</a>')
		});
		attachListeners();
    }});
}

function saveGame(){
	console.log('the saveGame function has been entered');
	if(game_saved == false){
		var values = {
	        'game': {
	          'state': boardState()
	        }
	      }
	    $.post('/games', values)
		    .done(function( data ) {
			    console.log("Game "+data.game.id+" saved!!");
			    game_saved = true;
			    console.log("game_saved set to TRUE");
			    gameID = data.game.id;

			    if(checkWinner()==true){
			    	resetGame();
				}
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
        		console.log("Game "+gameID+" patched!!");
        	}
		})
    }
}

function currentGame(){

}

function doTurn(state){
	updateState(state);
    turn++;
	if(checkWinner()==true){
		saveGame();
		//resetGame();
	}

}

function resetGame(){
	console.log('the resetGame function has been entered');
	turn = 0;
	$('td').empty();
	game_saved = false;
	console.log("game_saved set to FALSE");
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
	console.log('the game state has been updated');
    $(bla).append(player());
}

// function checkWinner(){
// 	is_the_game_over = false;
//     var board = boardState();
// 	var winningCombos = ['012', '345', '678', '036', '147',
// 	 '258', '048', '246'];
// 	winningCombos.forEach(function(combo) {
//     	combo = combo.split('');
//     	if (board[parseInt(combo[0])]==player() && 
//     		board[parseInt(combo[1])]==player() && 
//     		board[parseInt(combo[2])]==player()){
// 			message("Player "+player()+" Won!");
// 			is_the_game_over = true;
// 		}
// 		if(turn >= 8 && is_the_game_over == false){
// 			message("Tie game");
// 			is_the_game_over = true;
// 		}
// 	}); 
// 	if(is_the_game_over){
// 		console.log("THE GAME IS OVER!!!");
// 	}
// 	return is_the_game_over;
// }

function checkWinner(){
	console.log('has anyone won has been entered');
	is_the_game_over = false;
    var board = boardState();
	var winningCombos = ['012', '345', '678', '036', '147',
	 '258', '048', '246'];
	winningCombos.forEach(function(combo) {
    	combo = combo.split('');
    	if (board[parseInt(combo[0])]=='X' && 
    		board[parseInt(combo[1])]=='X' && 
    		board[parseInt(combo[2])]=='X'){
    		message("Player X Won!");
			is_the_game_over = true;
		}
		if (board[parseInt(combo[0])]=='O' && 
    		board[parseInt(combo[1])]=='O' && 
    		board[parseInt(combo[2])]=='O'){
			message("Player O Won!");
			is_the_game_over = true;
		}
		if(turn >= 8 && is_the_game_over == false){
			message("Tie game");
			is_the_game_over = true;
		}
	}); 
	console.log(is_the_game_over);
	return is_the_game_over;
}