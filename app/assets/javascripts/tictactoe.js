// Code your JavaScript / jQuery solution here

var turn = 0;
var gameId = 0;
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

///ON LOAD ///
//template ~> window.onload = () => {}

var player = () => (turn % 2) ? "O" : "X"

// function player(turn){
//   // returns "X" when turn count is even
//   // returns "O" when turn count is odd
//   if (turn % 2 === 0) {
//     return "X";
//   } else {
//     return "O";
//   };
// }

//document ready for Events
$(function(){
  attachListeners();
});

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
//$("td")[0].innerHTML = "X"
const myBoard = $("td")

for (const tokenPiece of myBoard) {
  console.log(tokenPiece);
}


function updateState(){
  //player clicks on a box, the box gets an X or O depending on turn count(which tells us which player is playing in player())
  // $("td").on("click", function(){
  //   $(this).innerHTML = player();
  // })
}


function setMessage(){
  //if winner is "X" setMessage() "Player X Won!";
  //if winner is "O" setMessage() "Player O Won!";
  // $("#message").innerHTML = `"Player ${winner} Won!"`
}

function checkWinner(){
  //when player wins horizontally return true
  //when player wins diagonally return true
  //when player wins vertically return true
  //return false if no winning combination is present
  //if winner is "X" setMessage() "Player X Won!";
  //if winner is "O" setMessage() "Player O Won!";
  //function(player, setMessage)
  //this.player = player()


  // filter the table for winningCombos
  // $("table td").filter(function(){
    // this.winningCombo = winningCombo
    // winningCombo.filter

  // })
}

function doTurn(){
  //increments value of "turn" variable
  //invokes checkWinner()
  //invokes updateState()
  //invokes setMessage()
    //"Tie game" if tied
  //resets board and "turn" counter when game is Won

}



function attachListeners(){

  $("#save").on("click", function(e){
    e.preventDefault;
    // gameId++;
    alert("save")
  });

  $("#previous").on("click", function(e){
    e.preventDefault;
    // --gameId;
    alert("previous")
  });

  $("#clear").on("click", function(e){
    e.preventDefault;
    // $("td").empty();
    alert("clear")
  });

  // $("td").doTurn();
}
