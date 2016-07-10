var turn = 0;
var WIN_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
];
var currentGame = 0;

function attachListeners() {
  $('td').on('click', function(e){
    doTurn(e);
  });
  $('#previous').on('click', function(e){
    getAllGames();
  });
  $("#save").on("click", function(e){
    saveGame(false);
    if ($('#games').text().length > 0) {getAllGames();}
  });
  $("#games").on("click", function(e){
    loadGame(e);
  });
}

function doTurn(e) {
  updateState(e);
  if (checkWinner()) {
    saveGame(true);
    resetBoard();
    turn = 0;
    currentGame = 0;
  }
  else {
    turn++;
  }
}

function player() {
  if (turn % 2 === 0) {
    return "X";
  }
  else {
    return "O";
  }
}

function getX(boardPos) {
  return boardPos % 3;
}

function getY(boardPos) {
  return Math.floor(boardPos / 3);
}

function getTD(boardPos) {
  return $('[data-x="'+ getX(boardPos).toString() + '"][data-y="' + getY(boardPos).toString() + '"]');
}

function resetBoard() {
  $('td').each (function () {
    $(this).html("");
  });
}

function checkWinner() {
  for (var i = 0; i < WIN_COMBINATIONS.length; i++) {
    var a = WIN_COMBINATIONS[i][0];
    var b = WIN_COMBINATIONS[i][1];
    var c = WIN_COMBINATIONS[i][2];
    if ((getTD(a).text() == "X" && getTD(b).text() == "X" && getTD(c).text() == "X") ||
      (getTD(a).text() == "O" && getTD(b).text() == "O" && getTD(c).text() == "O")) {
      message("Player " + player() + " Won!"); 
      return true;
    }
  }
  if (turn == 8) {
    // tie game
    message("Tie game");
    return true;
  }
  return false;
}

function getBoardPos(e) {
  return ($(e.target).attr("data-x")+($(e.target).attr("data-y")*3)).to_i;
}

function updateState(e) {
  if ($(e.target).text() === "") {
    $(e.target).text(player());
  }
}

function message(string) {
  $("#message").html(string);
}

function getAllGames() {
  $('#games').html("");
  $.ajax({
    url: "/games",
    method: "GET",
    dataType: "json",
    success: function(data) {
     if (data.length > 0) {
       var prevGames = "";
       $.each(data, function(index, game){
         prevGames += '<li data-gameid="' + game.id + '">Game '  + game.id + '</li>';
       });
       $("#games").html(prevGames);
     }
    }
  });
}
//$('#games').append("<li " + "data-gameid=" + game.id + ">" + "Game " + game.id + "</li>");
function getCurrentState() {
  state = [];
  $('td').each(function(index) {
    console.log($(this).text());
    state.push($(this).text());
  });
  console.log(state);
  return state;
}

function saveGame(reset) {
  var url;
  var method;
  var current_state = getCurrentState();
  if (currentGame === 0) {
    console.log("POSTING");
    url = "/games";
    method = "POST";
  }
  else {
    console.log("PATCHING");
    console.log(currentGame);
    url = "/games/" + currentGame
    method = "PATCH";
  }
  $.ajax({
    url: url,
    method: method, 
    dataType: "json",
    data: {
      state: current_state
    },
    success: function(resp) {
      if (reset) {
        currentGame = 0;
      }
      else {
        currentGame = resp["id"];
      }
    }

  });
}

function loadGame(event) {
 currentGame = $(event.target).data("gameid");

 $.get('/games/' + currentGame, function(data) {
     var state = data["state"]
     currentGame = data.id
     turn = $.grep(state, function(e){ return e != "" }).length;
     $('td').each(function(index, cell){$(cell).text(state[index])});
     checkWinner();
 });
}

$(document).ready(function () {
  attachListeners();
});
