// Code your JavaScript / jQuery solution here

/// GLOBAL ///
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
/// END GLOBAL ///

/// ON LOAD ///
  //document ready for Events
$(function(){
  attachListeners();
});

  //template ~> window.onload = () => {}
  //zero = false; one = true
// let player = () => (turn % 2) ? "O" : "X"
/// END ON LOAD ///

/// Set the Player's Token ///
function player(){
  // returns "X" when turn count is even
  // returns "O" when turn count is odd
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  };
}
/// END Player ///

/// Build the Board ///
  //the board has nine squares but eight in computer speak
  //each square has its own index
  //so... define the square
  //the square is noted as 'td' in html
const square = document.getElementsByTagName("td")


// def display_board
//     puts " #{@board[0]} | #{@board[1]} | #{@board[2]} "
//     puts "-----------"
//     puts " #{@board[3]} | #{@board[4]} | #{@board[5]} "
//     puts "-----------"
//     puts " #{@board[6]} | #{@board[7]} | #{@board[8]} "
//   end
/// END Board ///

/// MESSAGE FOR WINNER ///
function setMessage(){
  //if winner is "X" setMessage() "Player X Won!";
  //if winner is "O" setMessage() "Player O Won!";
  $("#message").innerHTML = `"Player ${winner} Won!"`
}
/// end of message ///





/// UPDATE THE STATE OF THE GAME ///
function updateState(){
  //player clicks on a box, the box gets an X or O depending on turn count(which tells us which player is playing in player())
  // $("td").on("click", function(){
  //   $(this).innerHTML = player();
  // })
}
/// End of Update ///

/// Checking the Winner ///
function checkWinner(){
  //check the boardCombo
    //when player wins horizontally return true
    //when player wins diagonally return true
    //when player wins vertically return true
    //return false if no winning combination is present

    //define callback for the boardCombo
    //turn = aggregate; el = element; i = index; square = current array
  const getSquaresToken = function(el, i, square){
    console.log('the token', el);
    console.log('the tokens index', i);
    console.log('the current array', square);
  };
    //define iteration of the squares with the callback
  const myForEach = function(square, getSquaresToken){
    for (const token of square){
      getSquaresToken(token, square.indexOf(token), square);
    }
  };

  myForEach(square, getSquaresToken);
    //compare/filter the results of myForEach to winningCombos
    // $("table td").filter(function(){
      // this.winningCombo = winningCombo
      // winningCombo.filter
    // })
        //if winner is "X" setMessage() "Player X Won!";
        //if winner is "O" setMessage() "Player O Won!";
      //setMessage(winner);
}
/// end checking winner ///

/// PLAYING THE GAME ///
function doTurn(){
  //increments value of "turn" variable
  //invokes checkWinner()
  //invokes updateState()
  //invokes setMessage()
    //"Tie game" if tied
  //resets board and "turn" counter when game is Won


  /////getAttribute = .attr
  /////finding out if the box is X or O
  $("table tr td").click(function(){
    let mark = $(this).attr('data-x');
    let yark = $(this).attr('data-y');
    alert("this is " + mark + yark);
  })

  //Get each table td box, add 1 to its position, then filter/compare to the winning combo
  //$("td")
  //=>[0,1,2,3,4,5,6,7,8] 9 boxes

  //add the token to the td's index
  // $("td")[0].innerHTML = "X"
  const myBoard = $("td")
  for (const tokenPiece of myBoard) {
    console.log(tokenPiece);
  }



}
/// End of Play ///

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
    $("td").empty();
  });

  // $("td").doTurn();
}
