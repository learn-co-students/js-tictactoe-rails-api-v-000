// Code your JavaScript / jQuery solution here
var turn = 0

var winningBoard = [
   [0,1,2],
   [3,4,5],
   [6,7,8],
   [0,3,6],
   [1,4,7],
   [2,5,8],
   [0,4,8],
   [2,4,6]
 ]


function isEven(turn) {
  return turn % 2 === 0;
}

function player(){
  return isEven(turn) ? 'X' : 'O';
}

function updateState(position){
  position.innerHTML = player();
}

function setMessage(string){
  $("#message").html(string);
}

function checkWinner(){
	var currentBoard = []
	$('td').toArray().forEach(x => currentBoard.push(x.innerHTML))
	function winningCombo(currentVal) {
		if (currentBoard[currentVal[0]] === currentBoard[currentVal[1]] && currentBoard[currentVal[1]] === currentBoard[currentVal[2]] && currentBoard[currentVal[0]] !== "") {
			return true;
		}
	}
	return winningBoard.some(winningCombo)
}

function doTurn(position){


}

function attachListeners(){

}
