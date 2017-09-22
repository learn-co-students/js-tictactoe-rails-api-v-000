var turn = 0;
var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var squares = window.document.querySelectorAll('td');
var gameId = 0;


$(document).ready(function(){
	attachListeners()
})

function attachListeners(){
	$("td").on("click", function(){
		if (!checkWinner()){
			doTurn(this)
		}	
	})

   $('button#save').on('click', () => saveGame());
   $('button#previous').on('click', () => showPreviousGames());
   $('button#clear').on('click', () => clearBoard());


}

function saveGame(){
	var board = []
	var data = {}
	$("td").text((index, content) => {board.push(content)})

	data["state"] = board
 	if (gameId === 0){
		$.post('/games', data, function(game) {
	      gameId = game.data.id;
	    });
	}else{
		$.ajax({
			type: 'PATCH',
            url: '/games/' + gameId,
            data: data
		})
	}
}

function showPreviousGames(){
	$("div#games").empty()
	$.get('/games', function(data){

		data["data"].forEach((e) => {
			$("div#games").append(`<button type='button' id=gameid-${e.id}>Game: ${e.id}</button>`)
			$(`#gameid-${e.id}`).on('click', () => {loadGame(e.id)})
		})
	})
}

function loadGame(id){
	$.get(`/games/${id}`, function(data){
		gameId = data.data.id
		$("td").empty()

		var state = data.data.attributes.state
		turn = state.join('').length;

	    let index = 0;
	     for (let y = 0; y < 3; y++) {
	       for (let x = 0; x < 3; x++) {
	         document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
	         index++;
	       }
	     }
	})
}

function clearBoard(){
	$("td").empty()	
    turn = 0
    gameId = 0
}

function player(){
	if (turn % 2 == 0){
		return 'X'
	}
	else if (turn % 2 != 0){
		return 'O'
	}
}

function updateState(square){

	var token = player()
	if (square.innerHTML === ""){
    	$(square).append(token)
    	return true
	}else{
		return false
	}
}

var message = function message(message) {
  $("div#message").append(message);
};

function testX(element){
	return $("td")[element].innerHTML === "X"  && $("td")[element].innerHTML != ""
}


function testO(element){
	return $("td")[element].innerHTML === "O"   && $("td")[element].innerHTML != ""

}

function checkWinner(){
	var winner = false;
	WINNING_COMBOS.some((combination_array) => {
		if (combination_array.every(testX)){
			 winner = true
			 message("Player X Won!")

			 return true

		}else if(combination_array.every(testO)){
           	  
           	 winner = true
			 message("Player O Won!")

             return true

        }else{ 
        	   winner = false
        	   return false
        	}
	})
	 return winner
}


function doTurn(element){
	if (updateState(element)){
		turn++;
	}

	if (checkWinner()){
		clearBoard()
		saveGame()
	}else if(turn === 9){

	    message("Tie game.")
		clearBoard()
		saveGame()
	}


}