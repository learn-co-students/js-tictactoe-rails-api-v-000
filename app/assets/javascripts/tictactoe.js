////// necessary variables

var turn = 0;
var currentGame = 0;
var winner = "";
var stateOfGame = [];
var winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
// old:
// [ 
//   ['[data-x="0"][data-y="0"]', '[data-x="0"][data-y="1"]', '[data-x="0"][data-y="2"]'],
//   ['[data-x="1"][data-y="0"]', '[data-x="1"][data-y="1"]', '[data-x="1"][data-y="2"]'],
//   ['[data-x="2"][data-y="0"]', '[data-x="2"][data-y="1"]', '[data-x="2"][data-y="2"]'],
//   ['[data-x="0"][data-y="0"]', '[data-x="1"][data-y="0"]', '[data-x="2"][data-y="0"]'],
//   ['[data-x="0"][data-y="1"]', '[data-x="1"][data-y="1"]', '[data-x="2"][data-y="1"]'],
//   ['[data-x="0"][data-y="2"]', '[data-x="1"][data-y="2"]', '[data-x="2"][data-y="2"]'],
//   ['[data-x="0"][data-y="0"]', '[data-x="1"][data-y="1"]', '[data-x="2"][data-y="2"]'],
//   ['[data-x="2"][data-y="0"]', '[data-x="1"][data-y="1"]', '[data-x="0"][data-y="2"]']
// ];

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
  $("#games").on("click", "[data-gameid]", function(event) {
    loadGame(event);
  });
}

////// persistence

function getPreviousGames() {
  $.get("/games", function(data){
    if (data.games.length > 0) {
      var prevGames = "";
      $.each(data.games, function(index, game){
        prevGames += '<p data-gameid="' + game.id + '">Game '  + game.id + '</p>';
      });
      $("#games").html(prevGames);
    }
  });
}

function saveGame(gameState, gameOver = false) {
  // build current gameData for saving  
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
        if (gameOver === false) {
          currentGame = response.game.id;
        }
    });
  }
  else { // update the existing game in the db
    $.ajax({
      url: "/games/" + currentGame,
      type: 'PATCH',
      dataType: 'json',
      data: gameData
    }).done(function(response){
    });
  }
}

function loadGame(event) {
  currentGame = $(event.target).data("gameid");
  debugger;
  var url = "/games/" + currentGame;
  $.get(url, function(data){ // not getting called!
    debugger;
    // this works fine when I play around in the browser on the rails server, but fails running the Jasmine test
    // I get this alert in the console when I run the Jasmine test:
    // "jquery.min.js:4 XMLHttpRequest cannot load file:///games. Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https, chrome-extension-resource."
    // am I supposed to use jsonp or something?
    state = data.game.state;
    $("td").each(function(index, td){
      $(td).text(state[index]);
    });
  });
}

////// playing the game

function doTurn(event) {
  updateState(event);
  stateOfGame = [];
  $("td").each(function(index, td){
    stateOfGame.push($(td).text());
  });
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
  turn = 0;
  currentGame = 0;
  $("td").each(function(index, td){
    $(td).text("");
  });
}

function won(gameState) {
  return winCombos.some(function(combo) { // this function returns true if there is a winning combo
    var allX = combo.every(function(position){ // allX is true if there is a winning X combo
      return gameState[position] === "X";
    });
    var allO = combo.every(function(position){ // allO is true is there is a winning O combo
      return gameState[position] === "O";
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
  var wonGame = won(stateOfGame);
  if (wonGame === true) { // call message with winner
    message("Player " + winner + " Won!");
    resetBoard();
    saveGame(stateOfGame, true);
  }
  else if (turn === 9) { // if the board is full and nobody won
    message("Tie game");
    resetBoard();
    saveGame(stateOfGame, true);
  }
  else {
    return false;
  }
}

////// document ready!

$(document).ready(function() {
  attachListeners();
});