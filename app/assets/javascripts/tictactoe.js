////// necessary variables

var turn = 0;
var currentGame = 0;
var winner = "";
var winCombos = [
  ['[data-x="0"][data-y="0"]', '[data-x="0"][data-y="1"]', '[data-x="0"][data-y="2"]'],
  ['[data-x="1"][data-y="0"]', '[data-x="1"][data-y="1"]', '[data-x="1"][data-y="2"]'],
  ['[data-x="2"][data-y="0"]', '[data-x="2"][data-y="1"]', '[data-x="2"][data-y="2"]'],
  ['[data-x="0"][data-y="0"]', '[data-x="1"][data-y="0"]', '[data-x="2"][data-y="0"]'],
  ['[data-x="0"][data-y="1"]', '[data-x="1"][data-y="1"]', '[data-x="2"][data-y="1"]'],
  ['[data-x="0"][data-y="2"]', '[data-x="1"][data-y="2"]', '[data-x="2"][data-y="2"]'],
  ['[data-x="0"][data-y="0"]', '[data-x="1"][data-y="1"]', '[data-x="2"][data-y="2"]'],
  ['[data-x="2"][data-y="0"]', '[data-x="1"][data-y="1"]', '[data-x="0"][data-y="2"]']
];

////// listeners

function attachListeners() {
  $("td").click(function(event) {
    doTurn(event);
  });
  $("#previous").click(function(event) {
    getPreviousGames();
  });
  $("#save").click(function(event) {
    saveGame();
  });
  $("a.prev-game").click(function(event) {
    loadGame(event);
  });
}

////// persistence

function getPreviousGames() {
  $.get("/games", function(data){
    if (data.games.length > 0) {
      var prevGames = "";
      $.each(data.games, function(index, game){
        prevGames += '<a href="#" class="prev-game" data-gameid="' + game.id + '">Game '  + game.id + '</a>';
      });
      $("#games").html(prevGames);
    }
  });
}

function saveGame() {
  // build current gameData for saving
  debugger;
  // currentGame should be 0 on first test & second test
  var gameState = [];
  $("td").each(function(index, td){
    gameState.push($(td).text());
  });
  var gameData = {
    game: {
      id: currentGame,
      state: gameState
    }
  };
  // if currentGame = 0, it hasn't been saved to the db
  if (currentGame === 0) {
    $.ajax({
      url: '/games',
      type: 'POST',
      dataType: 'json',
      data: gameData
      }).done(function(response){
        var wonGame = won();
        debugger;
        if (wonGame === false) {
          currentGame = response.game.id;
        }
    });
  }
  else {
    debugger;
    $.ajax({
      url: "/games/" + currentGame,
      type: 'PATCH',
      dataType: 'json',
      data: gameData
    });
  }
}

function loadGame(event) {
  event.preventDefault();
  currentGame = $(event.target).data("gameid");
  debugger;
  $.get("/games/" + currentGame, function(data){
    var state = data.game.state;
    $("td").each(function(index, td){
      $(td).text(state[index]);
    });
  });
}

////// playing the game

function doTurn(event) {
  updateState(event);
  turn += 1;
  checkWinner();
}

function player(){
  if (turn % 2 === 0) {
    return "X";
  }
  else {
    return "O";
  }
}

function updateState(event) {
  $(event.target).text(player());
}

function message(string) {
  $('#message').text(string);
}

function resetBoard() {
  saveGame();
  debugger;
  turn = 0;
  currentGame = 0;
  $("td").each(function(index, td){
    $(td).text("");
  });
}

function won() {
  return winCombos.some(function(combo) { // this function returns true if there is a winning combo
    var allX = combo.every(function(element){ // allX is true if there is a winning X combo
      return $(element).text() === "X";
    });
    var allO = combo.every(function(element){ // allO is true is there is a winning O combo
      return $(element).text() === "O";
    });
    if (allX === true) { // set the winner for the message
      winner = "X";
    }
    else if (allO === true) {
      winner = "O";
    }
    else {
      winner = "";
    }
    return allX || allO; // if there is a winner, this returns true
  });
}

function checkWinner() {
  var wonGame = won();
  debugger;
  if (wonGame === true) { // call message with winner
    message("Player " + winner + " Won!");
    resetBoard();
  }
  else if (turn === 9) { // if the board is full and nobody won
    message("Tie game");
    resetBoard();
  }
  else {
    return false;
  }
}

////// document ready!

$(document).ready(function() {
  attachListeners();
});