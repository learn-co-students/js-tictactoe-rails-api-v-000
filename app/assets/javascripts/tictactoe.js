// Code your JavaScript / jQuery solution here

/// GLOBAL VARIABLES///
let turn = 0;
let game = 0;
var winningCombo = [
  [0, 1, 2], // first row across
  [3, 4, 5], // second ""
  [6, 7, 8], // third ""
  [0, 3, 6], // first column down
  [1, 4, 7], // second ""
  [2, 5, 8], // third ""
  [0, 4, 8], // diagonal from left
  [6, 4, 2]  // diagonal from right
]

/// ON LOAD ///
  // 1. document ready for Events
$(function(){
  attachListeners();
});

  /// 2A. Set the Board ///
    // the board has nine squares but eight in computer speak
    // each square ('td') has its own index
    // so... define the board & make the squares clickable
const boardState = [" "," "," "," "," "," "," "," "," "]; //=> [td, td, td, td, td, td, td, td, td]

//every turn a state is updated
// checkwinner() checks boardState
// does checkwinner compare with winningCombo?

  /// 2B. Set the board's square to be clickable
    /// !!!!!! DO NOT DELETE THIS COMMENT ///

    // $('td').click(function(){
    //   this
    // }) .... this.innerHTML = " " will be filled in via updateState() within doTurn()

  //passes the clicked-on td element to doTurn() as position
  //need to define position
  //the event listeners that invoke doTurn() when a square is clicked on
function theSquare(){
  let move = $('td').on("click", function(e){
    e.preventDefault;
    doTurn(this)
  })
}

  /// 3. Set the turnCount ///
    // to determine the currentPlayer
    // turn will increment in doTurn()
function turnCount(turn){
  turn % 2 === 0
}

  /// 4. Set the currentPlayer
    // based on turnCount
      // returns "X" when turnCount is even
      // returns "O" when turnCount is odd
function player(){
  return turnCount(turn) ? "X" : "O";
}

  /// 5. Set the resetBoard
function resetBoard(){
  $("td").each(function(){
    $(this).empty();
  });
  turn = 0;
  game = 0;
}


/// STARTING THE GAME ///

//pushing object (board) into new array to compare the index with winningCombo
//determine the board's indexes => Object.keys
  //these indexes help compare the indexes of winningCombo
//define a new board to push the new indexes
// let a = {};
// let b = (a[0] = board);
// let boardIndex = Object.keys(b);
// let newBoard = [];
//
// let bed = parseInt(boardIndex[0])
//
// //  newBoard.push(boardIndex)
// //
// // newBoard;
//
// function map (array, callback) {
//   const newArr = [];
//
//   for (const element of array) {
//     newArr.push(callback(element));
//   }
//
//   return newArr;
// }
//
// const newBoard = map(board, function(ind){
//   return ind;
// })
// newBoard;
//
// const newA = map(board, function(ind){
//   return ind[i];
// })
// newA;
//
// newBoard[1] = [boardIndex[0], boardIndex[1], boardIndex[2]]
// newBoard[2] =  [boardIndex[3], boardIndex[4], boardIndex[5]]
// newBoard[3] =  [boardIndex[6], boardIndex[7], boardIndex[8]]
// newBoard[4] =  [boardIndex[0], boardIndex[3], boardIndex[6]]
// newBoard[5] =  [boardIndex[1], boardIndex[4], boardIndex[7]]
// newBoard[6] =  [boardIndex[2], boardIndex[5], boardIndex[8]]
// newBoard[7] =  [boardIndex[0], boardIndex[4], boardIndex[8]]
// newBoard[8] =  [boardIndex[6], boardIndex[4], boardIndex[2]]



  /// Place the Player's token on the board's squares ///
    // doTurn() PASSES "clicked square" (the square itself from boardState())
    // Player clicks on PASSED "clicked square"; it will be invoked by updateState()
    // the PASSED "clicked square" gets token ("X" or "O") based on turn count, which is incremented in doTurn()
      //the PASSED "clicked square" can't change the token once it's been set
        //if the PASSED "clicked square" is empty, then set the token
        //otherwise show the existing token
function updateState(move){
  $(move).text(player()); //the user is clicking on the square (clicked element is 'td'); once clicked, the player places their token within the text attribute of td
  const index = $(move).data('index'); //we've added a new data attribute to td (data-index); we are defining the index as the attribute
  boardState[index] = player(); // now we're calling the boardState's index as the newly add data attribute of 'data-index'; then we say that empty boardState is equal to the player's token
}

  /// Calling the winner ///
    // if winner is "X" setMessage() "Player X Won!";
    // if winner is "O" setMessage() "Player O Won!";
function setMessage(message){
  $("div#message").text(message)
}

  /// Checking the winner ///
    // Compare the boardState()'s indexes to those of winningCombo
    // boardState and winningCombo are both nested arrays
      // when player wins horizontally return true
      // when player wins diagonally return true
      // when player wins vertically return true
      // return false if no winning combination is present
function checkWinner(move){
  // let token = player();
  // for(let combo of winningCombo) {
  //   // debugger;
  //   if (boardState[combo[0]] !== "" && boardState[combo[0]]=== boardState[combo[1]] && boardState[combo[1]] === boardState[combo[2]]) {
  //     setMessage(`Player ${boardState[combo[0]]} Won!`);
  //   }
  // }
}

  /// Players take Turns playing ///
    // Iteration of gamePlay:
      // First Player sets their token on a square
        // turnCount increments
        // Second Player sets their token on another square
          // turnCount increments
      // iteration stops
        //...invokes checkWinner() to find a Winner
          // invokes setMessage()
          // RESETS board and turnCount when game is won
        //...invokes checkWinner() to find a Tie
          // iteration stopped at the boardState's length + 1
function doTurn(move){
  updateState(move); //first token placed ("X")
  turn++; // turn + 1; now it's ('O')'s turn
  //second token checks for a valid position
    //if position is valid (position is blank)
      //make a move => updateState(move)
      //otherwise don't update position (position = position)
  // checkWinner(move);
  // if won {
  //   resetBoard();
  //   turn = 0
  // }
  //
  // if tied {
  //   setMessage("Tie game");
  // }

}


/// Actions for the buttons ///
function saveGame(){
  $("button#save").on("click", function(){

  });
}

function previousGame(){
  $("button#previous").on("click", function(){

  });
}

function clearGame(){
  $("button#clear").on("click", function(){

  });
}

/// Buttons ////
function attachListeners(){
  theSquare(); //invoke the passed element of td into doTurn() which is invoked in theMove() upabove under ON LOAD
  saveGame();
  previousGame();
  clearGame();
}
