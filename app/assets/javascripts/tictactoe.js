// Code your JavaScript / jQuery solution here
var currentGame = 0;
var turn = 0;

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

  function updateState(clicked) {
    clicked.innerHTML = player()
  }

  function setMessage(message) {
    $("#message").text(message);
  }

  function checkWinner(){
    let boardState = {}
    let winner = false;

    $('td').text((index, square) => boardState[index] = square);

    WIN_COMBOS.forEach(function(combo){
      if(boardState[combo[0]] === boardState[combo[1]] && boardState[combo[1]] === boardState[combo[2]]
     && boardState[combo[0]] !== ""){
       setMessage(`Player ${boardState[combo[0]]} Won!`)
       return winner = true;
     }
    })
    return winner;
  }

  function doTurn(clicked){
    updateState(clicked);
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

  function showPreviousGames() {
    $("#games").empty();
    $.get("/games", function(games){
      games.data.map(function(game){
        $("#games").append(`<button id="gameid-${game.id}">${game.id}</button>`);
        $("#gameid-" + game.id).click(() => loadGame(game.id));
      })
    })
  }

  function loadGame(gameID) {
  $('#message').text("");
  let id = gameID;
  $.get(`/games/${gameID}`, function(game) {
    let state = game.data.attributes.state;
    $("td").text((index, token) => state[index]);
    currentGame = id;
    turn = state.join("").length;
    checkWinner();
  });
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

$(document).ready(function(){
  attachListeners();
});
