// Code your JavaScript / jQuery solution here
var turn = 0;
var gamesId = undefined;

function player() {
	return (turn % 2 === 0) ? "X" : "O";
}

function updateState(square) {
	$(square).html(player());
}

function message(output) {
	$('#message').text(output);
}

function currentBoard() {
    return $("td").map((i, td) => td.innerHTML).get()
}

function checkWinner() {
	var board = currentBoard();
	var win_combinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; 
	
	return ["X", "O"].some(function(player) {
        if (win_combinations.some(function(winner) {
            return winner.every(i => board[i] === player);
        })) {
                message(`Player ${player} Won!`);
                return true;
            }
        return false;
    });
}

function doTurn(square) {
	if (square.innerHTML !== "" || checkWinner()) {
		return;
	} 
	updateState(square);
	turn += 1;
	if (checkWinner() === false) {
		if (turn === 9) {
			message("Tie game.");
			saveGame();	
			resetGame();
		}	
	} else {
		saveGame();
		resetGame();
	}
}

// Document ready
$(function () {
    attachListeners();
});

function attachListeners() {
	// Grab square that is clicked on and send to doTurn()
	$("td").on("click", function() {
		window.doTurn(this);
	});

	// If save button is clicked
	$('#save').on("click", function() {
        saveGame();
    });

	// if clear button is clicked
    $('#clear').on("click", function() {
        resetGame();
    });
	
	// if previous button is clicked
	$('#previous').on("click", function() {
         $.get('/games').done(function(response){
             var buttons = response.data.map(game => (`<button>${game["id"]}</button>`));
            $("#games").html(buttons);
        });     
    });

	// if a previous game is clicked
    $('#games').on("click", function (e) { 
        $.get(`/games/${e.target.innerHTML}`).done(function(response){ 
            var state = response.data.attributes.state
            $('td').each(function(i, td) {
                td.innerHTML = state[i];
            })
            turn = state.filter(function(t){
                 return t != "";
            }).length  
            gamesId = response.data.id;
        });        
    });
}

function saveGame(){
    if (!gamesId){
    //create new game
     $.post('/games',{ state: currentBoard()} ).done(function(response) {
      gamesId = response.id;
     });
     //update existing game
    } else { 
        $.ajax({
        	type: 'PATCH',
        	url: `/games/${gamesId}`,
        	data: 'state='+currentBoard()+''
        });
    }
}

function resetGame() {
	$("td").html("");
	turn = 0;
	gamesId = undefined;
	$('#message').html('');
	$('#games').html('');
}




