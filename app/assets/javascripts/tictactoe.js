var currentGame = 0;
var turn = 0;
var over = false

var winningCombinations = [
    [[0,0],[1,0],[2,0]],
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]],
    [[0,0],[0,1],[0,2]],
    [[2,0],[2,1],[2,2]],
    [[1,0],[1,1],[1,2]],
    [[2,0],[1,1],[0,2]]
  ];

// Event listeners

function attachListeners(){
  $('td').click(function(event){
    doTurn(event);
  })

  $("#previous").click(function(event) {
    oldGames();
  });

  $("#save").click(function(event) {
    saveGame();
    if ($('#games').text().length > 0) {oldGames()}
  });

  $("#games").on("click", function(event) {
    loadGame(event);
  });
}


// Play Mechanics

function doTurn(event){
  updateState(event);
  if (checkWinner()) {
    saveGame();
    resetBoard();}
  else {
  turn += 1;};};
// }

function updateState(event){
    $(event.target).text(player());
}

function player(){
  return (turn % 2) ? "O" : "X";
}

function checkWinner(){
  var tie = $('td').filter(function(index, char){return $(char).text() === ""});
  var winner = winningCombinations.filter(function(combo) {
  return ($('td[data-x=' + combo[0][0] + '][data-y=' + combo[0][1] + ']').text() === player()) &&
  ($('td[data-x=' + combo[1][0] + '][data-y=' + combo[1][1] + ']').text() === player()) &&
  ($('td[data-x=' + combo[2][0] + '][data-y=' + combo[2][1] + ']').text() === player());
  });

  if (tie.length === 0) {
    message("Tie game");
    over = true
    return true;

  }
  else if (winner.length > 0) {
    message("Player " + player() + " Won!");
    over = true
    return true;

  }
  else {return false;}
}

function message(string) {
  $('#message').text(string);
}

function resetBoard() {
  // debugger;
  turn = 0;
  currentGame = 0;
  $("td").html("");
  // over = false;
  // message("")
}


// Persistnce

function oldGames() {
  $.get("/games", function(data){
    if (data.games.length > 0) {
      var prevGames = "";
      $.each(data.games, function(index, game){
        prevGames += '<li data-gameid="' + game.id + '">Game '  + game.id + '</li>';
      });
      $("#games").html(prevGames);
    }
  });
}

function findcurrentBoard() {
   return ($.map($('td'), function(cell, index){
    return $(cell).text();}));
}



//
function saveGame(){
  // debugger;
  if (currentGame == 0) {
    var url = '/games';
    var method = "POST";
  }
  else {
    var url = '/games/' + currentGame;
    var method = "PATCH";
  }
  // debugger;
  $.ajax(
    { url: url,
      type: method,
      dataType: "json",
      data: {state: findcurrentBoard()}
    })
    .done(function(success) {
      // debugger;
      if (over != true){
      currentGame = success.game.id;}
      else { currentGame = 0; over = false};
      // if (over === true) {debugger; resetBoard()}
      // else {currentGame = success.game.id;};
      // over = false
      // debugger;
    })
}

//
function loadGame(event) {
  currentGame = $(event.target).data("gameid");

  $.get('/games/' + currentGame, function(data) {
      var game = data["game"];
      var state = game["state"]
      currentGame = game.id
      turn = $.grep(state, function(e){ return e != "" }).length;
      $('td').each(function(index, cell){$(cell).text(state[index])});
      checkWinner();

  });
}

//
//
//
//
//
//
//
//
//
//
//


$('document').ready(function(){

  attachListeners();

});
