// Code your JavaScript / jQuery solution here
// keep track of turns
var turn = 0;
var gameId = 0;
// all listed winning combinations
const winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];
//document is loaded, call listeners
$(function () {
  attachListeners();
});

// sets player token
function player(){
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

// adds player token to board square
function updateState(td){
  let token = player();
  $(td).text(token);
}

// adds message on screen of end result
function setMessage(string){
  $("#message").text(string);
}

//checks game to see if anyone won, sets message if true
function checkWinner(){
  // create a board array
  var board = []
  // create variable to track if game was won
  let hasWon = false
  // takes the text at each square and sets it up as a index[value] in board
  $('td').text((index, square) => board[index] = square);
  // check each const wincombo for matches that are not empty strings
  winCombos.forEach(function(combo){
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      hasWon = true
      setMessage('Player ' + board[combo[0]] + ' Won!')
    }
  })
  return hasWon
}

// makes the move of updating board, increment turn, check for wins
function doTurn(td){
  updateState(td);
  turn++;
  if (checkWinner()){
    // reset board if there's a winner
    saveGame();
    resetBoard();
    // else if no winner and turns are up, let players know they tied
  } else if (turn === 9){
    setMessage('Tie game.')
    saveGame();
    resetBoard();
  }
}
// reset board by emptying text in each square and resetting turn to 0
function resetBoard(){
  $("td").empty();
  turn = 0;
  gameId = 0;
}

// gameId of not saved games is 0, so if gameId === 0, then you must post the response
// otherwise, patch it
function saveGame(){
  var state = []
  $('td').text((index, square) => state[index] = square);
  if (gameId === 0){
    $.ajax({
      type: 'POST',
      url: '/games',
      data: {state: state}
    }).done(function(data){
      gameId = data.data.id;
    });
 } else {
     $.ajax({
       type: 'PATCH',
       url: `/games/${gameId}`,
       data: {state: state}
     });
   }
 }

//loads the previous game status onto the current board
function previousGame(){
  $.get("/games", function(data){
    //debugger
      data.data.forEach(function(game){
        //debugger
        if (data.data.length > document.getElementsByClassName('gameLoaded').length){
          //debugger
        $('#games').append(`<button class="gameLoaded" id="gameid-${game.id}">Game ${game.id}</button><br>`);
        $(`#gameid-${game.id}`).on('click', function(){
          $.ajax({
            method: 'GET',
            url: `/games/${game.id}`
          }).done(function(data){
            board = data.data.attributes.state
            //debugger
            gameId = data.data.id
            for (i = 0; i < board.length; i++){
              $('td')[i].innerHTML = board[i]
            }
            turn = $('td').text().length
          })
        })
      }
    })
  })
}

function loadGame(){

}
// defining all listeners
function attachListeners(){
  //clicking on specific square will run doTurn and add your move
  $("td").on("click", function(){
    if (this.innerHTML === "" && !checkWinner()){
      doTurn(this);
    }
  })

  $("#save").on("click", function(){
    saveGame();
  })
  //clicking on the clear current game button will reset the board
  $("#clear").on("click", function(){
    resetBoard();
  })

  $("#previous").on("click", function(){
    previousGame();
  })
}
