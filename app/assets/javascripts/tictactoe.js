// Code your JavaScript / jQuery solution here

// FRONT END //
$(document).ready(function() {
  attachListeners();
});
//create current game variable that starts at 0
var currentGame = 0;// 0 is falsey and 1 is truthy in js
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

     td.innerText = token
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
    turn+=1;
  //  debugger
    //turn++;
    // checkWinner();
    if (checkWinner()) {
      saveGame();
      resetBoard();
    } else if (turn === 9 ){
      setMessage('Tie game.');
      saveGame();
      resetBoard();
    } else if (isTaken()){
         player();
    }
  }

  function resetBoard() {
    $("td").empty();
    turn = 0;
    currentGame = 0;
  }

function attachListeners(){
  // code to be executed goes here
  $("td").on("click", function(event){
  //  console.log(this)
  //  console.log(event)
  if (!checkWinner() && !$.text(this)) {
    doTurn(this);
  }

  });

  $("#save").on("click", function(event){
    //console.log(event)
    saveGame();
  //  console.log(event)

  });

  $("#previous").on("click", function(event){
    //console.log(event)
    previousGames();
  //  console.log(event)

  });

  $("#clear").on("click", function(event){
    //console.log(event)
    clearGame();
  //  console.log(event)

  });


}

function isTaken() {
  var aElement = player();
  if (aElement === 'X' || aElement === 'O') {
    var position = player();
      return position;
  }
}

// BACK END //


// Attaches the appropriate event listeners to:
// (1) the squares of the game board
// (2) the button#save, button#previous, and button#clear elements.



// SAVE - Clicking a saved game button (in the div#games element)
// -save the current game state
//
// SAVE - if the current game has not yet been saved
// - (should) saving it should save the state of the game in the database.
// - if state is blank
//  - save the state should be saved in the db
//  - if we press save again the game state should be updated
//
// SAVE - if the current game already exists in the database
// - (should) saving it should update that previously-saved game
function saveGame(){
  //debugger
  //var board = access all of text inside td for each square
  var aBoard = $("td").map(function( key, value ) {
    //alert(value);
    return value.innerText
     console.log( value );
  });
  // this is just letting me know of the keys
  // $("td").each(function(key, value) {
  //       alert(key)
  // });
  var board = Array.from(aBoard)
  var gameBoard = {state: board}
  //debugger

  // store the state of the board in a variable called gameBoard

  // check if their is a current game do below
   if (!currentGame) {//!0 = true - if not saved
    // $() /games/new
    $.post("/games",
    {
      state: board
    },
    function(board){
      currentGame = board.data.id
      // debugger
    //  alert("board: " + board);
    }
    );
  } else {
    $.ajax(
    {
      state: board,
      type: "patch",
      url: `/games/${currentGame}`
    },
    function(board){
      alert("board: 2" + board);
    }
    );
  }


  // if currentGame then do a patch request - to send the game board data
  // - the url is the url of the current game
  // if not do a post request - function
  // - updating currentGame

  // create a button for this game and append to our #games
}


// PREVIOUS - grab all of the persisted games from the database and create a button for each
// - ( when clicked ) returns the game state to the ttt board
// NOTE - All of the buttons should be added to the div#games element
function previousGames() {
  $.get("/games", function(response){

        if (response.data.length) {
          var aUl = document.createElement("ul");
          $("#games").empty();
        //  $("#games").append(aUl);
          response.data.forEach(function(game) {
          // create a new button and add it to the document
            var btn = document.createElement("button");
            btn.setAttribute('data-game-id', game.id);
            btn.innerHTML= game.id;
            gameIdentifer = btn.innerHTML
            btn.addEventListener("click", () => { reloadGame(game.id)});//reloadGame(game.id)
            // var allbuttonElements = $( "button" );
            // //debugger
            // if ($( "#games" ).find(gameIdentifer)){
              $( "#games" ).append(btn)
            // }else{
            //   null
            // }
        });
      }
  });
}
function reloadGame(gameId){
  $.get(`/games/${gameId}`, function(response){
    const theState = response.data.attributes.state;
    var i = 0;
    for (var y=0; y < 3; y++) {
      for (var x=0; x < 3; x++) {
          document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = theState[i]
        turn = theState.join("").length
        currentGame = gameId
          i++;
      }
    }
  });
}
// CLEAR - clear the game board && start a completely new game
// BEHAVOR of clear //
// (1) button#save - game persisted to the database.

// (2) button#clear - clear the game board && start a completely new game
// (3) button#save -  ^ this game persisted to the database.
// expected result - two games should have been persisted to the database //
function clearGame() {
  // alert("Hello!");
  resetBoard();
  // var aBoard = $("td").map(function( key, value ) {
  //   return value.innerText
  //    console.log( value );
  // });
  // var board = Array.from(aBoard)
  // var gameBoard = {state: board}
  //   $.post("/games", { state: board },
  //   function(board){
  //     currentGame = board.data.id
  //   }
  // );
}
