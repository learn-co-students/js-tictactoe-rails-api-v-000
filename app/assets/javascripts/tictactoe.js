// Code your JavaScript / jQuery solution here
var turn = 0; 
currentGame = 0; 
var winningCombinations = [
  // Horizontals
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  // Verticals
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  // Diagonals
  [0, 4, 8],
  [2, 4, 6]
];




/*function populateBoard() {		
	var nodes = document.querySelectorAll("td");
	var list = [].slice.call(nodes);
	board = list.map(function(e) { return e.innerText; });	

    return board; 
	
} */
/*
function getCombos(player) {
	self.populateBoard(); 
	var indexArray = $.map(board, function(elementOfArray, indexInArray) {
        return elementOfArray == player ? indexInArray : null;
	});		
	return indexArray
}

*/

function player() {
	if (turn % 2 === 0) {
		return 'X'
	} else
	return 'O'

}

function updateState(square) {		
	val = player() 
	$(square).text(val); 
}


function doTurn(sq) {	
	
	self.updateState(sq); 	
	turn++; 	
	if (checkWinner()) {		
		$( "#save" ).trigger( "click" );
		$('td').empty();
		turn = 0; 
		currentGame = 0; 
		
	} else if (turn === 9) {
		$( "#save" ).trigger( "click" );
		message("Tie game.")
		$('td').empty();
		turn = 0; 
		currentGame = 0; 
	}

	
}


function message(winningMessage) {	
	$("#message").text(winningMessage); 
}



function checkWinner() {
	var board = {}; 
	var w = false; 

	 $('td').text(function(i, square) {
	 	board[i] = square
	 });
	 
	$.each(winningCombinations, function(i, combo) {
		win_index1 = combo[0]
    	win_index2 = combo[1]
    	win_index3 = combo[2]

    	position_1 = board[win_index1]
    	position_2 = board[win_index2]
    	position_3 = board[win_index3]

    	

    if ((position_1 === "X" && position_2 === "X" && position_3 ==="X") || (position_1 === "O" && position_2 === "O" && position_3 === "O")) {       
    	
      	self.message(`Player ${position_1} Won!`) 	
      	return w = true;
      	
      	
       }  
    });
	return w; 
	/* $('td').text((index, square) => board[index] = square);

	winningCombinations.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      message(`Player ${board[combo[0]]} Won!`);
      return w = true;
    }
  });

  return w; */
}

	/*

		$.each(winningCombinations, function(i, combo) {
		win_index1 = combo[0]
    	win_index2 = combo[1]
    	win_index3 = combo[2]

    	position_1 = board[win_index1]
    	position_2 = board[win_index2]
    	position_3 = board[win_index3]



    if (position_1 === "X" && position_2 === "X" && position_3 ==="X") {       
      	self.message("Player X Won!") 	
      	w = true;
      	
      	
       } else if (position_1 === "O" && position_2 === "O" && position_3 === "O") {
       	self.message("Player O Won!") 	
       	w = true;
       	
       	
       }  
    }); */

	




function attachListeners(abbrev) {
    
    var p = self.player()
    
    $('td').click(function() {  		  		
    	
  		if ((checkWinner() === false) && ($(this).is(':empty'))) {
  			$(this).text(p)
	  		doTurn(this); 
  		}
  		
	})

	$('#save').click(function() {
		var state = []; 
		var gameData; 

		$('td').text(function(i, sq)  {
			state.push(sq); 
		});

		gameData = {state: state}; 

		if (currentGame) {
			$.ajax({
				type: 'PATCH', 
				url: `/games/${currentGame}`,
				data: gameData
			}); 
		} else {
			$.post('/games', gameData, function(game) {
				currentGame = game.data.id; 
				$('#games').append(`<button id="gameId-${game.data.id}">${game.data.id}</button><br>`)
				$("#gameId-" + game.data.id).on('click', function() {
					reloadGame(game.data.id); 
				})
			})
		}
	})

	$('#previous').click(function() {
		$('#games').empty(); 
		$.get('/games', function(savedGames) {
			if (savedGames.data.length) {
				savedGames.data.forEach(buttonizePreviousGame); 
			}
		}); 
	})

	$('#clear').click(function(event) {
		$('td').empty();
		turn = 0; 
		currentGame = 0; 
	})


}

function buttonizePreviousGame(game) {
	$('#games').append(`<button id="gameId-${game.id}">${game.id}</button></br>`); 
	$(`#gameId-${game.id}`).on('click', function() {
		reloadGame(game.id); 
	})
}

function reloadGame(gameId) {
	
	const xhr = new XMLHttpRequest; 
	xhr.overrideMimeType('application/json'); 
	debugger
	xhr.open('GET', `/games/${gameId}`, true); 
	xhr.onload = function() {
		const data = JSON.parse(xhr.responseText).data; 
		const id = data.id; 
		const state = data.attributes.state; 

		let index = 0
		for (let y = 0; y < 3; y++) {
			for (let x = 0; x < 3; x++) {
				document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index]; 
				index++; 
			}
		}
		turn = state.join('').length; 
		currentGame = id; 

		if (!checkWinner() && turn ===9) {
			message('Tie game.'); 

		}
	}; 

	xhr.send(null); 
}

$(document).ready(function() {
	//const squares = window.document.querySelectorAll('td');
	
	
    	attachListeners();

}); 

/*function checkWinner() {	
	blahx = self.getCombos('X')
	blaho = self.getCombos('O')
  
	$.each( winningCombinations, function( i, val ) {
  		
  		if ((val.every(function(v) { return blaho.indexOf(v) >= 0; })) ||
  		(val.every(function(v) { return blahx.indexOf(v) >= 0; }))) {
  			console.log('o or x')
  			if (val.every(function(v) { return blaho.indexOf(v) >= 0; })) {
  				self.message("Player O Won!"); 
  			}
  			else {
  				self.message("Player X Won!"); 	
  			}
  		
  		} 

  	
  			return true; 
 			
	});
		return false; 
	
} */