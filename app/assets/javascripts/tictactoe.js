// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame;

$(function(){
   attachListeners()
});

function attachListeners() {
  $('#clear').on('click', function () {
    clearGame();
  });
  $('#save').on('click', function () {
    saveGame();
  });
  $('#previous').on('click', function () {
    previousGame();
  })

  $('td').on('click', function() {
    if ($(this).text() === "" && !checkWinner()) {
      doTurn(this);
    }
  });
}

function player(){
  if (turn % 2 === 0){
  return "X";
  } else {
    return "O";
  }
}

function updateState(square){
  $(square).text(player());
}

function setMessage(string){
  $("#message").text(string)
}

function checkWinner(){
  const wins = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]];
  let winner = false
  const board = $("td").map(function() {
    return $(this).html()
  }).toArray();

  wins.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      winner = true;
      setMessage(`Player ${board[combo[0]]} Won!`);
    }
  });
  return winner;
}

function doTurn(token){
  updateState(token);
  turn ++;

  if (checkWinner()){
    saveGame();
    clearGame();
  } else if (turn === 9){
    setMessage("Tie game.");
    saveGame();
    clearGame();
  }
}

function previousGame() {
  $("#games").empty();
  $.get("/games", function(games) {
    games.data.forEach(function(game) {
      $("#games").append(`<button id="gameId-${game.id}" data-id="${game.id}">${game.id}</button><br>`)
      $(`#gameId-${game.id}`).on('click', getGame)
    });
  });
}

function getGame(event) {
  var id = event.target.dataset.id
  $.get(`/games/${id}`, function(game) {
    const gameBoard = game.data.attributes.state
      debugger;


    $("td").text(function(index) {
      return gameBoard[index];
    });

    turn = gameBoard.filter(function(x) {
      return x !== ""
    }).length;
    currentGame = id;
  })
}

function saveGame() {
  const stateData = $("td").map(function() {
    return $(this).html()
  }).toArray();

  const gameState = {state: stateData};

  if (currentGame) {
    $.get({
      url: `/games/${currentGame}`,
      type: "PATCH",
      data: gameState
    });
  } else {
    $.post("/games", gameState).done(function(game) {
      currentGame = game.data.id;
    });
  };
}

function clearGame() {
  $("td").empty();
  turn = 0;
  currentGame = 0;
}
