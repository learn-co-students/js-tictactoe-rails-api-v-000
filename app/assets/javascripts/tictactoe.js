var turn = 0;
var currentGame;
const WIN_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

$(document).ready(function(){
  attachListeners();
})

function attachListeners() {
  $("td").on('click', function(){
    doTurn(this);
  });
  $("#previous").on('click', function(event){
    event.preventDefault();
    getAllGames();
  });
  $("#save").on('click', function(event){
    event.preventDefault();
    saveGame();
  })
  $("#games").on('click', function(event){
    var id = $(event.target).data("gameid");
    var state = $(event.target).data("state").split(",");
    loadGame(id, state);
  })
}

function doTurn(field) {
  updateState(field);
  turn++;
  if (checkWinner() || checkTie()){
    resetBoard();
  }
}

function checkTie() {
  if (turn >= 9) {
    message("Tie game");
  }
}

function checkWinner() {
  var state = currentState();
  var winner;
  $.each(WIN_COMBINATIONS, function(i, combination){
    var pos_1 = combination[0];
    var pos_2 = combination[1];
    var pos_3 = combination[2];

    if (state[pos_1] !== "" && state[pos_1] === state[pos_2] && state[pos_2] === state[pos_3]){
      winner = state[pos_1];
    }
  })

  if (winner) {
    message("Player " + winner + " Won!");
    return winner;
  } else {
    return false;
  }
}

function updateState(field) {
  $(field).text(player());
}

function player() {
  if (turn % 2 == 0){
    return "X";
  } else {
    return "O";
  }
}

function message(string) {
  $("div#message").text(string);
  saveGame(true);
  resetBoard();
}

function currentState() {
  var fields = $("td");
  var state = [];
  $.each(fields, function(i, field){
    state.push($(field).text());
  });
  return state;
}

function resetBoard() {
  $("td").text("");
  turn = 0;
}

function getAllGames() {
  $.get("/games", function(data) {
    var games = data["games"];
    var gameInfo = "";
    $.each(games, function(i, game){
      gameInfo += '<li data-gameid="' + game["id"] + '" data-state="' + game["state"] + '">' + game["id"] + '</li>'
    });
    $("#games").html(gameInfo);
  });
}

function setTurn(state){
  var turn = 0;
  for(var i = 0; i < state.length; i++){
    if(state[i] === "X" || state[i] === "O"){
      turn++;
    }
  }
  return turn;
}

function loadGame(id, state){
  currentGame = id;
  turn = setTurn(state);
  $("td").each(function(i, field){
    $(field).text(state[i]);
  });
}

function saveGame(reset) {
  var url;
  var method;

  if(currentGame > 0) {
    url = "/games/" + currentGame
    method = "PATCH"
  } else {
    url = "/games"
    method = "POST"
  }

  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: { 
      game: {
        state: currentState()
        }
      },
      success: function(data) {
      if(reset) {
        currentGame = undefined;
      } else {
        currentGame = data["game"]["id"];
      }
    }
  });
}

