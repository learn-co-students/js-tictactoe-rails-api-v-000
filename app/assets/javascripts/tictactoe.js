// Code your JavaScript / jQuery solution here
var turn = 0; 

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

    var board = ['','','','','','','','',''];
	var indices_x = [];
	var indices_o = [];



function populateBoard() {		
	var nodes = document.querySelectorAll("td");
	var list = [].slice.call(nodes);
	board = list.map(function(e) { return e.innerText; });	

    return board; 
	
}

function getCombos(player) {
	self.populateBoard(); 
	var indexArray = $.map(board, function(elementOfArray, indexInArray) {
        return elementOfArray == player ? indexInArray : null;
	});		
	return indexArray
}



function player() {
	if (turn % 2 === 0) {
		return 'X'
	} else
	return 'O'

}

function updateState(square) {		
	val = self.player() 
	$(square).html(val); 
}


function doTurn(sq) {	
	turn++; 	
	self.updateState(sq); 	
	if (self.checkWinner() == true) {
		board = ['','','','','','','','','']
		turn = 0; 
	}

	
	
	
}

function message(winningMessage) {	
	$("#message").text(winningMessage); 
}



function checkWinner() {
	var b = self.populateBoard()
	var w = false; 
	if (board.includes('')) {
		$.each(winningCombinations, function(i, combo) {
		win_index1 = combo[0]
    	win_index2 = combo[1]
    	win_index3 = combo[2]

    	position_1 = board[win_index1]
    	position_2 = board[win_index2]
    	position_3 = board[win_index3]



    if ((position_1 == "X" && position_2 == "X" && position_3 == "X") || (position_1 == "O" && position_2 == "O" && position_3 == "O")){
       if (position_1 == "X" && position_2 == "X" && position_3 == "X") {
      	self.message("Player X Won!") 	
      	w = true;
      	return false;
      	
       } else  {
       	self.message("Player O Won!") 	
       	w = true;
       	return false;
       	
       }    

    } 
    
    

  	
	});

	} else {
    	self.message("Tie game.")
    	w = true;
    	return false;    	
    }

	return w;
    
		
}




$(document).ready(function() {
const squares = window.document.querySelectorAll('td');
	
	$(squares).click(function attachListeners(){
		ind = jQuery.inArray(this, squares)		
		self.doTurn(squares[ind]); 
		
	})


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