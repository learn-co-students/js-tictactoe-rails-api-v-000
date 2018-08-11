// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

let turn = 0;
let currentGame = 0;

$(document).ready(function() {
  attachListeners();
});

let player = () => turn % 2 ? "O" : "X";

function doTurn(square) {
   updateState();
   turn++ ;
   if (checkWinner()) {
     saveGame();
     resetBoard();
   } else if (turn === 9) {
     setMessage("Tie game.");
     saveGame();
     resetBoard();
     }
   }

function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function saveGame(){
  
}

function updateState() {
  $("td").html(player(turn));
  // I know this isn't right because it's not precise to the specific td I want to alter. also turn is not currently a real thing, it's still just a stub.
  //the square's coordinates are going to be available when this gets called in the on.click event listener
  //set the innerHTML of that <td> to the return value of player(turn)
}

function setMessage(string) {
  $("#message").html(string);
}

// create the win conditions array and then set horizontalWin to be true if any of the horizontal combos is true using something like include. do the same for vertical and diagonal.


function checkWinner() {
  let horizontalWin
  let verticalWin
  let diagonalWin
  if (horizontalWin || verticalWin || diagonalWin) {
    setMessage(`Player ${player(turn)} Won!`);

    return true;
  } else {
    return false;
  }
}
