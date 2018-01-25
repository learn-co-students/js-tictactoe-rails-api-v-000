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
  // document ready for Events
$(function(){
  attachListeners();
});

  /// Set the Board ///
    // the board has nine squares but eight in computer speak
    // each square ('td') has its own index
    // so... define the board & make the squares clickable
const board = document.getElementsByTagName('td'); //=> [td, td, td, td, td, td, td, td, td]

    // board is actually an Array-like object
    // how do I define this board as an array of indexes?
function setBoard(board){
  for (const square of board){
    console.log(index);
  }
}

  //how do I make the squares turn into an index
function turnElementToIndex(clickedElement){
  console.log('what')
}

function setBoard(board){
  Array.prototype.slice.call(datasets);
}

Array.prototype.setSquares = function(){
  for (i = 0; i < this.length; i++) {
      this[i] = this[i].to_s;
  }
}

board.setSquares

/////getAttribute = .attr
$("table tr td").click(function(){
  let mark = $(this).attr('data-x');
  let yark = $(this).attr('data-y');
  alert("this is " + (mark+yark));
})



  /// Set the turnCount ///
    // to determine the currentPlayer
    // turn will increment in doTurn()
function turnCount(turn){
  turn % 2 === 0
}

  /// Set the currentPlayer
    // based on turnCount
      // returns "X" when turnCount is even
      // returns "O" when turnCount is odd
function player(){
  return turnCount(turn) ? "X" : "O";
}

/// STARTING THE GAME ///

  /// Place the Player's token on the board's squares ///
    // doTurn() PASSES "clicked element"; it will be invoked by updateState()
    // Player clicks on PASSED element
    // the PASSED element gets token ("X" or "O") based on turn count, which is incremented in doTurn()
      //the PASSED element can't change the token once it's been set
        //if the PASSED element is empty, then set the token
        //otherwise show the existing token
function updateState(){
  passedElement.click(function(){
    this.html = player();
  });
  // let isSquareTaken = board.click(function(){
  //   if (this.textContent === "X" || "O") {
  //     this.textContent;
  //   } else {
  //     this.textContent = player();
  //   }
  // })


}

function setMessage(){
  //if winner is "X" setMessage() "Player X Won!";
  //if winner is "O" setMessage() "Player O Won!";
  $("#message").innerHTML = `Player ${winner} Won!`
}

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

  /// Players take Turns playing ///
    // First Player sets their token on a square
      // turnCount increments
      // Second Player sets their token on another square
        // turnCount increments


function doTurn(move){
  move = $("td").on("click", function(e){
    e.preventDefault;
    this.textContent
  })
  //increments value of "turn" variable
  turn += 1

  // invokes updateState() & passes the element that was clicked
  // if updateState(clickMove) === 0

  doTurn()


  //invokes checkWinner()

  //invokes setMessage()
    //"Tie game" if tied
  //resets board and "turn" counter when game is Won




}

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
