// Code your JavaScript / jQuery solution here
var turn = 0;

//Possible Winning Outcomes (This is a constant)
var WINNING_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8,], //Horizontal Wins
[0,3,6], [1,4,7], [2,5,8], //Vertical Wins
[0,4,8], [6,4,2]]; //Diagonal Wins

$(document).ready(function() {
  attachListeners();
});

function player(){
  if(turn % 2 === 0){
    return 'X';
  }
  else{
    return 'O';
  }
}

function updateState(square){
  //square ==> <td data-x="0" data-y="1"></td>
  //Setting a currentPlayer varaiable that will call the player function
  var currentPlayer = player();
  //Search for square and put the innerHTML or text as currentPlayer
  $(square).text(currentPlayer);
}

function setMessage(message){
  $('#message').text(message);
}

function checkWinner(){
  var winner = false;
  //Board will start as an empty object
  var board = {};
  //Goal is to populate the board object with the index and the square
  //square ==> <td data-x="0" data-y="1"></td>
  $('td').text((index, square)=> board[index]= square);
  WINNING_COMBINATIONS.forEach(function(position){
    if(board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== ""){
      //board[position[0]] ==> Signifies which ever X or O won. I.e the test calls for: "Player (X or O) Won!"
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  })
  return winner;
}

function doTurn(square){
  updateState(square);
  turn++;
  if (checkWinner()){
    clearGame();
  }else if (turn === 9){
    setMessage("Tie game.")
  }
}

function attachListeners(){
  $("td").on('click', function(){
    // Check to ensure that the square is empty
    if (this.innerHTML === ""){
      doTurn(this);
    }
  });

  $("#clear").on("click", function(){
    clearGame();
  });

  $("#save").on("click", function(){
    saveGame();
  });

  $("#previous").on("click", function(){
    alert("You clicked previous")
  });
}


function saveGame(){
  var gameBoard = [];
  var saveGameData;

  $('td').each(function(){
    gameBoard.push($(this).text());
  });
  saveGameData = {gameState: gameBoard}
  
  debugger;
}

function clearGame(){
  //Clears the board
  $('td').empty()
  //resets turn to 0
  turn = 0
}


function isEven(value){

}
