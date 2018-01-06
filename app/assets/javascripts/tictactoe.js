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

$(document).ready(function(){
  attachListeners();
});

function attachListeners(){
  $('td').each(function(key, value){
    this.addEventListener("click", function(){
      if(!checkWinner() && !checkTie()){
        doTurn(this);
      }}
    )
  })
}

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
  $("#message").text(string);
}

function setBoard(){
  var board = []
  $('td').toArray().forEach(x => board.push(x.innerHTML))
  return board
}

function checkWinner(){
  var win = false;
  var currentBoard = setBoard();
	function winningCombo(currentVal) {
		if (currentBoard[currentVal[0]] === currentBoard[currentVal[1]] && currentBoard[currentVal[1]] === currentBoard[currentVal[2]] && currentBoard[currentVal[0]] !== "") {
      setMessage(`Player ${currentBoard[currentVal[0]]} Won!`);
      return win = true;
		}
	}
	return winningBoard.some(winningCombo)
}

function checkTie(){
  return turn === 9;
}

function doTurn(position){

  if (position.innerHTML === ""){
    //doTurn() invokes the updateState() function
    updateState(position);
    //doTurn() increments the value of the "turn" variable
    turn++;
    //doTurn() invokes the setMessage() function with the argument "Tie game." when the game is tied
    //doTurn() invokes the checkWinner() function
    //doTurn() resets the board and the "turn" counter when a game is won
    if(checkWinner()){
      resetBoard();
    } else if (checkTie()){
      setMessage("Tie game.");
      resetBoard();
    }
  }
}

function resetBoard(){
  $('td').empty();
  turn = 0;
}
