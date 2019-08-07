// Code your JavaScript / jQuery solution here
$(document).ready(function() {
  attachListeners();
});
//create current game variable that starts at 0
var currentGame = 0;
var turn = 0;
//debugger
function player() {
  if ((turn % 2) == 0) {
     return 'X'
   } else {
     return 'O'
   }
}

function updateState(td) {
  //debugger
var token = player();
  if (!td.innerText) {
    turn+=1;
    td.innerText = token
  }
}

function setMessage(message) {
// debugger
  // document.getElementById("div#message").innerHTML = message
    $("div#message").append(message);
}

  function checkWinner() {
    var newArray = []
    var board = {};
    const WIN_COMBINATIONS = [
    [0,1,2],// Top row
    [3,4,5],  // Middle row
    [6,7,8],  // bottom row
    [0,3,6], // Left column
    [1,4,7],  // Middle column
    [2,5,8],  // Right column
    [2,4,6], // right diagonal
    [0,4,8] // left diagonal
  ]
  $("td").text((index, square) => board[index] = square)
   //debugger
  // for (var i = 0; i < 9; i++) {
  //     newArray.push($("td")[i].innerHTML);
  //   }
    var found = false
  var result =  WIN_COMBINATIONS.find(function(combo) {
      if (board[combo[0]] !== '' && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] ) {
      found = true
      return found
    } else {
      found = false
      return found
    }
    });
    //  console.log(result)
    if (result === undefined) {
      return false;

    } else {
      var message = ''
      if (board[result[0]] === 'X') {
        message = 'Player X Won!'
        setMessage(message);
        return true;
      } else if(board[result[0]] === 'O') {
        message = 'Player O Won!'
        setMessage(message);
        return true;
      }
    }
  }

  function doTurn(elementThatWasClicked) {

    updateState(elementThatWasClicked);
    //turn++;
    // checkWinner();
    if (checkWinner()) {
      resetBoard();
    } else if (turn === 9 && !checkWinner()){
      setMessage('Tie game.');
      resetBoard();
    } else if (isTaken()){
         player();
    }
  }

  function resetBoard() {
    turn = 0;
    $("td").empty();
  }

function attachListeners(){
  // code to be executed goes here
  $("td").on("click", function(event){
  //  console.log(this)
  //  console.log(event)
  doTurn(this);

  });
}

function isTaken() {
  var aElement = player();
  if (aElement === 'X' || aElement === 'O') {
    var position = player();
      return position;
  }
}



function saveGame(){
  //var board = access all of text inside td for each square
  var aBoard = $("td").map(function( key, value ) {
    return value.innerText
     console.log( value );
  });
  var board = Array.from(aBoard)
  var gameBoard = {state: board}
debugger
  // store the state of the board in a variable called gameBoard
  // check if their is a current game
   if (currentGame) {
    // $() /games/new

    $.post("games_path",
    {
      state: board
    },
    function(){
      //alert("Data: " + data + "\nStatus: " + status);
    }
    );


   }
  // if currentGame then do a patch request - to send the game board data
  // - the url is the url of the current game
  // if not do a post request - function
  // - updating currentGame

  // create a button for this game and append to our #games
}
