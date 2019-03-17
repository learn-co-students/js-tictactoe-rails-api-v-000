// import { uptime } from "os";

var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0

var player = () => turn % 2 === 0 ? "X" : "O";  

function updateState(square){

    var token = player();

    $(square).text(token);
}

function setMessage (s) {
  $('#message').text(s);
}

function checkWinner () {

  var board = {};

  var winner = false;

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some(function(combo){
    
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]){
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });
    return winner;
};

function doTurn (square) {
  
  updateState(square);
  
  //passing in the same variable to a function called by another function is no prob (and what I was going to code at first :) :) :) )
  turn++

  if (checkWinner() === true){
  //don't need to === true explicitly
  //this automatically calls checkWinner, no need to invoke it separately
    saveGame();
    clearBoard();

  } else if (turn === 9){
    setMessage("Tie game.");
      //don't have to declare a variable to pass tie game message through because setMessage does that
    saveGame();
    clearBoard();
  }
}
  

function attachListeners () {

}


function saveGame () {
  console.log("this saves the game")

}


function previousGame () {
  console.log("this shows the previous games")
}

function clearBoard () {
  console.log("this clears the game board")
}
