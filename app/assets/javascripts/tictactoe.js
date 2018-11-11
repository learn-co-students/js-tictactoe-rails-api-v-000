// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;

var WIN_COMBOS = [
     [0,1,2],
     [3,4,5],
     [6,7,8],
     [0,3,6],
     [1,4,7],
     [2,5,8],
     [0,4,8],
     [2,4,6]
  ]

// returns a string for player X or O
function player() {
  return turn % 2 ? "O" : "X"
}

//update square(the td element) on game board
function updateState(square) {
  square.innerHTML = player();
}

//adds a message 'Player X Won!' or 'Player O Won!'
function setMessage(message) {
  $("#message").text(message);
}

//use WIN_COMBOS to check for winners
function checkWinner(){
  let winner = false;
  let board = {}

  $('td').text((index, square) => board[index] = square);

  WIN_COMBOS.forEach(function(combo){
    if(board[combo[0]] === board[combo[1]] && board[combo[1]] == board[combo[2]]
   && board[combo[0]] !== ""){
     setMessage(`Player ${board[combo[0]]} Won!`)
     return winner = true;
   }
  })
  return winner;
}

// game turn
function doTurn(square) {
  updateState(square);
  turn++;

  if (checkWinner()){
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

//clears the game board
function resetBoard(){
  $('td').empty()
  turn = 0;
  currentGame = 0;
}

//saves a game
function saveGame(){
  let state = Array.from($('td'), e => e.innerText); //get the inner text of the td element as an array ["	", "	", "", "	", "X	", "O", "	", "X	", ""]
  if (currentGame) { //if currentGame exists then "update"
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      dataType: 'json',
      data: { state: state }
    });
  } else { // when currentGame is 0, create a new game board
    $.post('/games', { state: state }, function(game) {
      currentGame = parseInt(game.data.id); //set the game id to currentGame
    });
  }
}

function loadGame(gameId) {
  $('#message').text("");
  let id = gameId;
  $.get(`/games/${gameId}`, function(game) { //show game with GET games/:id
    let state = game.data.attributes.state; //sets the state to the game array ["", "", "X", "", "", "", "", "O", ""]
    $("td").text((index, token) => state[index]);
    currentGame = id;
    turn = state.join("").length;
    checkWinner();
  });
}

function showPreviousGames() {
  $("#games").empty();
  $.get("/games", function(games){
    games.data.map(function(game){
      $("#games").append(`<button id="gameid-${game.id}">${game.id}</button>`);
      $("#gameid-" + game.id).click(() => loadGame(game.id));
    })
  })
}

function attachListeners(){
  $("td").on("click", function(){
    if (!$.text(this) && !checkWinner()){ // this is the td element(if it's empty) && not a winner
      doTurn(this);
    }
  })
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

$(document).ready(function(){
  attachListeners();
});
