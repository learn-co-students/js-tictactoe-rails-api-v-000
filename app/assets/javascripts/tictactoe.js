$(document).ready(attachListeners)

var turn = 0;
var currentGame = 0;

var player = () => turn % 2 ? 'O' : 'X';

function attachListeners(){   
	
	$("td").click(function(){
	if(this.innerHTML === "" && !checkWinner()){
		doTurn(this)
	} else{
			alert("can't go there");
		};
	}); 

	$("#save").click(function(){
		saveGame()
	});

	$("#clear").click(function(){
  	$("td").empty()
	  turn = 0;
    currentGame = 0
  });

	$("#previous").click(function(){
		showPreviousGames()
	});
};

function updateState(args){
	let selectedSquare = args
  selectedSquare.append(player())
};

function doTurn(square){
	updateState(square)
	turn++;
	if (checkWinner()){
  	saveGame();
		$("td").empty();
	  turn = 0;
    currentGame = 0
  } else if (turn === 9){
	  setMessage("Tie game.");
	  saveGame();
    $("td").empty();
		turn = 0;
    currentGame = 0;
   };
}; 

function saveGame() {
  
  let state = [];
  
  $('td').text((index, square) => {
    state.push(square);
  });

  let gameData = {state};

  if (currentGame) {
    $.ajax({type: 'PATCH', url: "/games/" + currentGame , data: gameData});
  } else {
    $.post("/games", gameData, function(game) {
      
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => showPreviousGames(game.data.id));
      currentGame = game.data.id;
    });
  };
};


function setMessage(message){
  alert(message)
  $('#message').append(innerHTML = message)
};

function showPreviousGames() {
 $('#games').empty();
  $.get('/games', (savedGames) => {
 	if (savedGames) {
  	savedGames.data.forEach(function(game) {
    $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
    
    $(`#gameid-${game.id}`).click(function() {
    	
    	$.get( `/games/${game.id}`, function(dataResult) {
			  
				const id = dataResult.data.id;
  			const gameState = dataResult.data.attributes.state;
    
  			let index = 0;
  
	 				for (let y = 0; y < 3; y++) {
	    			for (let x = 0; x < 3; x++) {
	     			 
	     			 document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = gameState[index];
	    
	    		index++;

	    		turn = gameState.join('').length;
	    		currentGame = id;
	      		};
    			};
  			});
   		});
  	 });
   };
 });
};

function checkWinner(){
	
	let board = {}
	let winner = false

  $('td').text((index, square) => board[index] = square);    

  if (board[0] ==="X" && board[1] ==="X" & board[2] ==="X"){setMessage("Player X Won!");;  return winner = true}

  else if (board[3] ==="X" && board[4] ==="X" & board[5] ==="X"){setMessage("Player X Won!");return winner = true}

  else if (board[6] ==="X" && board[7] ==="X" & board[8] ==="X"){setMessage("Player X Won!");return winner = true}

  else if (board[0] ==="X" && board[3] ==="X" & board[6] ==="X"){setMessage("Player X Won!");return winner = true}

  else if (board[1] ==="X" && board[4] ==="X" & board[7] ==="X"){setMessage("Player X Won!");return winner = true}

  else if (board[2] ==="X" && board[5] ==="X" & board[8] ==="X"){setMessage("Player X Won!");return winner = true}

  else if (board[0] ==="X" && board[4] ==="X" & board[8] ==="X"){setMessage("Player X Won!");return winner = true}

  else if (board[6] ==="X" && board[4] ==="X" & board[2] ==="X"){setMessage("Player X Won!");return winner = true}    else if (board[0] ==="O" && board[1] ==="O" & board[2] ==="O"){setMessage("Player O Won!");return winner = true}

  else if (board[3] ==="O" && board[4] ==="O" & board[5] ==="O"){setMessage("Player O Won!");return winner = true}

  else if (board[6] ==="O" && board[7] ==="O" & board[8] ==="O"){setMessage("Player O Won!");return winner = true}

  else if (board[0] ==="O" && board[3] ==="O" & board[6] ==="O"){setMessage("Player O Won!");return winner = true}

  else if (board[1] ==="O" && board[4] ==="O" & board[7] ==="O"){setMessage("Player O Won!");return winner = true}

  else if (board[2] ==="O" && board[5] ==="O" & board[8] ==="O"){setMessage("Player O Won!");return winner = true}

  else if (board[0] ==="O" && board[4] ==="O" & board[8] ==="O"){setMessage("Player O Won!");return winner = true}

  else if (board[6] ==="O" && board[4] ==="O" & board[2] ==="O"){setMessage("Player O Won!"); return winner = true}

  else {return winner=false}
};