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
function player() {
  return turn % 2 ? "O" : "X"
}

function updateState(square) {
  square.innerHTML = player();
}

function setMessage(message) {
  $("#message").text(message);
}

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

function resetBoard(){
  $('td').empty()
  turn = 0;
  currentGame = 0;
}

function attachListeners(){
  $("td").on("click", function(){
    if (!$.text(this) && !checkWinner()){
      doTurn(this);
    }
  })
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

function saveGame(){
  let state = Array.from($('td'), e => e.innerText);
  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      dataType: 'json',
      data: { state: state }
    });
  } else {
    $.post('/games', { state: state }, function(game) {
      currentGame = parseInt(game.data.id);
    });
  }
}

function loadGame(gameId) {
  $('#message').text("");
  let id = gameId
  $.get(`/games/${gameId}`, function(game) {
    let state = game.data.attributes.state;
    $("td").text((index, square) => state[index]);
    currentGame = id;
    turn = state.join("").length;
    checkWinner();
  });
}

function showPreviousGames() {
  $("#games").empty();
  $.get("/games", function(games){
    // debugger
    games.data.map(function(game){
      $("#games").append(`<button id="gameid-${game.id}">${game.id}</button>`);
      $("#gameid-" + game.id).click(() => loadGame(game.id));
    })
  })
}

$(document).ready(function(){
  attachListeners();
});
