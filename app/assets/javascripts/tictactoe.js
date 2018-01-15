// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGameId = 0;
var square = 0;
var rootUrl = "/games"
var boardState = ["", "", "", "", "", "", "", "", ""];

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  $("td").on("click", function(){
    if (!$.text(this) && !checkWinner()) {
      // if there is no winner than play tic tac toe
       square = this;
      doTurn(this);
    }
  })

  // on click of save button, save the game
 $("#save").on('click', saveGame);
 // on click of previous button show previously played games
 $("#previous").on('click', previousGames);
 // on click of clear button, clear the board
 $("#clear").on('click', clearBoard);
}

function doTurn(element) {
  // show element on board
  updateState(element);
  // increment the turn by 1
  turn = turn + 1;
  // if winner found
  if (checkWinner()) {
    // save the game
    saveGame();
    // clear th eboard for te next game
    clearBoard();
    }
    // else if turn is 9 then the match is Tie
  else if (turn === 9){
    // show message that match is a tie
    setMessage("Tie game.");
    //save the game
    saveGame();
    // clear the board for the next game
    clearBoard();
  }
}

function updateState(element) {
   // append the player to the html of that square
   var token = player();
  //  $("td").text(token);
   $(element).text(token);
  //  console.log(checkWinner());
}

function player() {
  // if even return "O" else return "X"
  return turn % 2 ? 'O' : 'X'
}

function checkWinner() {
  const  winCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [2, 4, 6],
      [0, 4, 8]
    ];
  // flag variable for winner
  var foundWinner = false;
  $('td').text((index, square) => boardState[index] = square);
  winCombinations.forEach(function(combinations){
    // run the check on each winning combination
      var index1 = 0;
      var index2 = 0;
      var index3 = 0;
      var token = 'X';
     for(var i = 0; i< combinations.length; i++) {
        index1 = combinations[0];
        index2 = combinations[1];
        index3 = combinations[2];
        // compare the token of each position with the next position in the winning combination
       if (boardState[index1] != "" && boardState[index1] === boardState[index2] && boardState[index2] === boardState[index3]) {
         //set message to id => #message that player X/O has won
         token = boardState[index1];
         setMessage(`Player ${token} Won!`);
        //  console.log("Player", board[index1], "won!");
        // return true if winner has been found
         return foundWinner = true;
       }
     }
   });
   // return false if there is no winner
   return foundWinner;
}

function setMessage(message) {
  $("#message").html(`<strong> ${message} </strong>`);
}

function saveGame(){
  // create state Array
  // create oject for the Game

  var gameObj = {state: boardState}

  // console.log(gameObj)

  // if currentGame is present
    // paas the data to games/currentGame which is id website, method PATCH and data: gameObject
  // else
    // post the gameObject to url: '/games'
    // give the currentGame id of the game => game.data.id
    // append a button for gameId
    // onclick to the button game.data.id reload game

  if (currentGameId) {
    // console.log("patch request")
    $.ajax({
      type: 'PATCH',
      url: rootUrl + `/${currentGameId}`,
      data: gameObj
    });
  } else {
    $.post(rootUrl, gameObj, function(game){
      currentGameId = game.data.id
      $("#games").append(`<button id="game-${currentGameId}">${currentGameId}</button><br/>`);
      $("#game-" + currentGameId).on('click', function(){
        loadGame(currentGameId);
      });
    });
  }

}

function loadGame(gameId){
  // load the game when the button is clicked
  $('#message').html("");
  var gameUrl = rootUrl + `/${gameId}`
  var id = 0;
  var state = [];
  // console.log("Loading game:", gameId)

  $.get(gameUrl, function(game){
    id = game.data.id;
    currentGameId = id;
    state = game.data.attributes.state
    // console.log(id, state)
    var index = 0;
    for (var y = 0; y < 3; y++) {
      for(var x = 0; x < 3; x++) {
        $(`[data-x="${x}"][data-y="${y}"]`).html(state[index]);
        index = index + 1;
      }
    }

    // loop to find the turn

    var count = 0;

    state.forEach(function(element){
      element === "" ? count : count ++;
    });
    turn = count;
  });

  if (!checkWinner() && turn === 9) {
    setMessage("Tie game.")
  }
}

function clearBoard(){
  // console.log("You clicked on ClearCurrentGame button!");
  // empty the board
  $('td').empty();
  // reset th eturn to 0
  turn = 0;
  //reset the currentGame to 0
  currentGameId = 0;
}

function previousGames(){
  // console.log("You clicked on ProviousGames button!");
  $("#games").text("");
  $.get(rootUrl, function (savedGames) {
    // console.log(savedGames.data.length);
    if (savedGames.data.length > 0) {
      savedGames.data.forEach(function(game) {
        $("#games").append(`<button id="game-${game.id}">${game.id}</button><br>`);
        $("#game-" + game.id).on('click', function(){
          loadGame(game.id);
        });
      });
    }
  });
}
