////// necessary variables

var turn = 0;
var currentGame = 0;
var winCombos = [
  ['[data-x="0"][data-y="0"]', '[data-x="0"][data-y="1"]', '[data-x="0"][data-y="2"]'], 
  ['[data-x="1"][data-y="0"]', '[data-x="1"][data-y="1"]', '[data-x="1"][data-y="2"]'], 
  ['[data-x="2"][data-y="0"]', '[data-x="2"][data-y="1"]', '[data-x="2"][data-y="2"]'], 
  ['[data-x="0"][data-y="0"]', '[data-x="1"][data-y="0"]', '[data-x="2"][data-y="0"]'], 
  ['[data-x="0"][data-y="1"]', '[data-x="1"][data-y="1"]', '[data-x="2"][data-y="1"]'], 
  ['[data-x="0"][data-y="2"]', '[data-x="1"][data-y="2"]', '[data-x="2"][data-y="2"]'], 
  ['[data-x="0"][data-y="0"]', '[data-x="1"][data-y="1"]', '[data-x="2"][data-y="2"]'], 
  ['[data-x="2"][data-y="0"]', '[data-x="1"][data-y="1"]', '[data-x="0"][data-y="2"]'] 
]

////// listeners

function attachListeners(){
  $("td").click(function(event){
    doTurn(event);
  });
  $("#previous").click(function(event){
    getPreviousGames();
  });
  $("#save").click(function(event){
    saveGame();
  })
  $("li").click(function(event){
    loadGame(event);
  });
}

////// persistence

function getPreviousGames(){
  $.get("/games", function(data){
    if (data["games"].length > 0) {
      var prevGames = "<ul>"
      $.each(data["games"], function(index, game){
        prevGames += '<li data-gameid="' + game["id"] + '">Game '  + game["id"] + '</li>'
      });
      prevGames += "</ul>"
      $("#games").html(prevGames);
    }
  });
}

function saveGame(){
  // build current gameData for saving
  var gameState = []
  $("td").each(function(index, td){
    gameState.push($(td).text());
  });
  var gameData = {
    game: {
      id: currentGame,
      state: gameState
    }
  }

  // if currentGame = 0, it hasn't been saved to the db
  if (currentGame === 0) {
    $.post("/games", gameData).done(function(response){  
      currentGame = response.game.id; // why is the response not returning the proper serialized @game? 
                                      // the controller seems to be returning the right object...
                                      // the tests pass because they stub the response
    });
  }
  else {
    $.ajax({
      url: "/games/" + currentGame,
      type: 'PATCH',
      dataType: 'json',
      data: gameData
    });
  }
}

function loadGame(event){
  currentGame = $(event.target).data("gameid");
  $.get("/games/" + currentGame, function(data){
    var state = data.game.state;
    $("td").each(function(index, td){
      $(td).text(state[index]);
    });
  });
}

////// playing the game

function doTurn(event){
  updateState(event);
  turn += 1;
  checkWinner();
}

function player(){
  if (turn % 2 === 0) {
    return "X";
  }
  else {
    return "O"
  }
}

function updateState(event){
  $(event.target).text(player());
}

function message(string){
  $('#message').text(string);
}

function resetBoard(){
  saveGame();
  turn = 0;
  currentGame = 0;
  $("td").each(function(index, td){
    $(this).text("");
  });    
}

function checkWinner(){
    var winner = "";
    if (winCombos.some(function(combo) { // if this function returns true, aka if there is a winning combo
      var allX = combo.every(function(element){
        return $(element).text() === "X";
      });
      var allO = combo.every(function(element){
        return $(element).text() === "O";
      });
      allX ? winner = "X" : allO ? winner = "O" : winner // set the winner variable for the message
      return allX || allO;
    })) { // call message with winner
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

$(document).ready(function(){
  attachListeners();
});