// Code your JavaScript / jQuery solution here

/// GLOBAL VARIABLES///
let turn = 0;
let gameId = 0;
const winningCombo = [
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

  /// 2. Set the Board ///
    // the board has nine squares but eight in computer speak
    // each square ('td') has its own index
    // so... define the board & make the squares clickable
const square = document.getElementsByTagName('td'); //=> [td, td, td, td, td, td, td, td, td]

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

/// STARTING THE GAME ///

  /// Place the Player's token on the board's squares ///
    // doTurn() PASSES "clicked square" (the square itself from setBoard())
    // Player clicks on PASSED "clicked square"; it will be invoked by updateState()
    // the PASSED "clicked square" gets token ("X" or "O") based on turn count, which is incremented in doTurn()
      //the PASSED "clicked square" can't change the token once it's been set
        //if the PASSED "clicked square" is empty, then set the token
        //otherwise show the existing token
function updateState(position){
  $(position).text(player());
}

  /// Calling the winner ///
    // if winner is "X" setMessage() "Player X Won!";
    // if winner is "O" setMessage() "Player O Won!";
function setMessage(message){
  $("div#message").text(message)
}

  /// Checking the winner ///
    // Compare the setBoard()'s indexes to those of winningCombo
    // setBoard and winningCombo are both nested arrays
      // when player wins horizontally return true
      // when player wins diagonally return true
      // when player wins vertically return true
      // return false if no winning combination is present
function checkWinner(){

  // setMessage(`Player ${winner} Won!`);

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
          // iteration stopped at the setBoard's length + 1
function doTurn(position){
  updateState(position);
  turn++;


  // if won {
  //   resetBoard();
  //   turn = 0
  // }
  //
  // if tied {
  //   setMessage("Tie game");
  // }

  // let won = square[i[0]] === square[i[1]] && square[i[1]] === square[i[2]] && square[i[2]] === square[i[0]]
  // let full = index === "X" || "O"
  // let draw = full && !won
  // let over = won? || draw?

}

function resetBoard(){
  $("td").each(function(){
    $(this).empty();
  });
}

/// Actions for the buttons ///
// function saveGame(){
//   // $("td")
//   gameId++;
//   // this.id = gameId
//   setMessage("")
// }
//
// function previousGame(){
//   $("td").empty();
//   turn = 0;
//   setMessage("")
// }
//
// function clearGame(){
//   // $("td").empty();
//   turn = 0;
//   setMessage("")
// }

/// Buttons ////
function attachListeners(){
  $("#save").on("click", function(e){
    e.preventDefault;
    // gameId++;
    saveGame();
    alert("save")
  });

  $("#previous").on("click", function(e){
    e.preventDefault;
    // --gameId;
    previousGame();
    alert("previous")
  });

  $("#clear").on("click", function(e){
    e.preventDefault;
    clearGame();
  });

    //passes the clicked-on td element to doTurn() as position
    //need to define position
    //the event listeners that invoke doTurn() when a square is clicked on
  let position = $('td').on("click", function(e){
    e.preventDefault;
    doTurn(this.innerHTML)
  })

/// !!!!!! DO NOT DELETE THIS COMMENT ///
  /// the clicked square on board ///

  // $('td').click(function(){
  //   this.innerHTML = "x"
  // })

}
