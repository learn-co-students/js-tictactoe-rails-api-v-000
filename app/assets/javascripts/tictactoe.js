// Code your JavaScript / jQuery solution here
function player (turn) {
  let playerToken = (turn % 2 === 0) ? "X" : "O";
  return playerToken;
}

let tieGame = true;
let turn = 0;
// turnCounter will be increased each time doTurn() gets called.
function doTurn() {
   turn += 1 ;
   updateState();
   checkWinner();
   if(tieGame){
     setMessage("Tie Game");
   } else if (gameWon) {
     turn = 0;
     //clear the board somehow. check the tests for how to make this work.
   }

}

//listener needs to call doTurn() to increase the turn counter, then call updateState, passing in the coordinates of the square that was clicked (this will be using the data-x and data-y attributes)

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
