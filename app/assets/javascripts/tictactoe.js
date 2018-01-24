// Code your JavaScript / jQuery solution here

const turn = 0;
const gameId = 0;

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


function player(){
  //returns "X" when turn count is even
  //returns "O" when turn count is odd
  // if turn % 2 {
  //   return "X";
  // } else {
  //   return "O";
  // }
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





//Document Ready for Events
$(function(){
  attachListeners();
})

function attachListeners(){

  $("#save").on("click", function(e){
    e.preventDefault;
    gameId++;
  });

  $("#previous").on("click", function(e){
    e.preventDefault;
    --gameId;
  });

  $("#clear").on("click", function(e){
    e.preventDefault;
    $("td").empty();
  });

  $("td").doTurn();
}
