var turn = 0;

var winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

var currentState = ["", "", "", "", "", "", "", "", ""];

var currentGame;

// Set up game

$(function(){
  attachListeners();
});

function attachListeners () {
  $("td").click(function(){
    var currentCell = this;
    doTurn(currentCell);
  });

  $("#save").click(function(e){
    e.preventDefault();
    saveGame();
  });

  $("#previous").click(function(e){
    e.preventDefault();
    findPreviousGames();
  });  

  $("#games").click(function(e){
    var gameId = $(e.target).data("gameid");
    loadGame(gameId);
  });
}

// Actions
function doTurn (currentCell) {
  updateState(currentCell);

  // Update current state to include recent turn
  var state = [];
  $("td").each(function(index, cell) {
    state.push($(cell).text());
  });

  currentState = state;

  turn++;
  checkWinner();

}

function updateState (currentCell) {
  $(currentCell).text(player);
}

function message (message) {
  $("#message").html(message);
}

// Get game state information
function player () {
  return turn % 2 === 0 ? "X" : "O";
}

function checkWinner () {
  winningCombinations.forEach(function(combo) {
    if (  currentState[combo[0]] != "" &&
          currentState[combo[0]] === currentState[combo[1]] &&
          currentState[combo[1]] === currentState[combo[2]]) {

      message("Player " + currentState[combo[0]] + " Won!");
      var gameEnded = true;      
      saveGame(gameEnded);
      resetBoard();
    } else if (turn === 9) {
      message("Tie game");
      var gameEnded = true;        
      saveGame(gameEnded);
      resetBoard();
    }
  });

  return false;
  
}

function gameData() {
  return {"game": {"state": currentState}};
}

// Ajax requests and game changes
function saveGame (gameEnded) {

  if (currentGame) {
    $.ajax({
      url: "/games/" + currentGame,
      method: "patch",
      data: $.param(gameData())
    }).done(function(data){
      console.log("Game " + currentGame + " saved!");
    }).fail(function(error){
      console.log("Something went wrong: " + error.errorThrown);
    });

  } else {
    $.ajax({
      url: "/games",
      method: "post",
      data: $.param(gameData())
    }).done(function(data){
      if (gameEnded != true){
        currentGame = data.game.id;
      }

      console.log("Game saved!");
    }).fail(function(error){
      console.log("Something went wrong: " + error.errorThrown);
    });

  }
}

function resetBoard () {
  turn = 0;
  $("td").each(function(){
    $(this).html("");
  });
}

function findPreviousGames () {
  $.get("/games", function(data) {
    if (data.games.length > 0) {
      var previousGames = '';

      data.games.forEach(function(game) {
        previousGames += '<li class="game" data-gameid="' + game["id"] + '">' + game["id"] + '</li>';
      });

      $("#games").html(previousGames);
    }
  });
}

function loadGame (gameId) {
  $.get("/games/" + gameId, function(data){
    currentState = state;
    currentGame = gameId;

    var state = data.game.state;
    $("td").each(function(index, cell){
      $(cell).text(state[index]);
    });
  });

  setTurn();
  console.log("Loaded game " + gameId);
}

function setTurn () {
  var countXsAndOs = 0;

  currentState.forEach(function(cell, index) {
    if (cell[index] === "X" || cell[index] === "O") {
      countXsAndOs++
    }
  });

  turn = countXsAndOs;  
}












