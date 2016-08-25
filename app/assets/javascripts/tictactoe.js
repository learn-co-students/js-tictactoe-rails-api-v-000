var turn = 0;
var winningCombos = [
[[0,0],[1,0],[2,0]], 
[[0,1],[1,1],[2,1]], 
[[0,2],[1,2],[2,2]], 
[[0,0],[1,1],[2,2]], 
[[0,0],[0,1],[0,2]], 
[[2,0],[2,1],[2,2]], 
[[1,0],[1,1],[1,2]], 
[[2,0],[1,1],[0,2]]
];

function attachListeners(){
	$("td").on("click", doTurn);
}

function doTurn(event){
	var cell = $(this);
	turn++;
	updateState(cell);
	checkWinner();
}

function updateState(cell){
	cell.text(player());
}

function isX(cellCoords){
	var cell = $('[data-x="' + cellCoords[0] + '"][data-y="' + cellCoords[1] + '"]');
	return cell.text() == "X"
}

function isO(cellCoords){
	var cell = $('[data-x="' + cellCoords[0] + '"][data-y="' + cellCoords[1] + '"]');
	return cell.text() == "O"
}

function checkWinner(){

  winningCombos.forEach(function(combo){
  	var allX = combo.every(isX);

  	var allO = combo.every(isO);

  	if(allX){
  		alert("X Wins!");
  	}
  	else if(allO){
  		alert("O Wins!")
  	}
  });
 
}


function player(){
	if(turn % 2 == 0){
		return "O";
	}
	else{
		return "X";
	}
}

$(document).ready(function(){
	attachListeners();
});