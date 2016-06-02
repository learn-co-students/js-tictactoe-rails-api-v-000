var currentGame = 0;
var turn = 0;
var currentBoard = []

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


function resetBoard() {
  turn = 0;
  currentGame = 0;
  $("td").each(function(index, td){
  $(td).text("");
  });
}

function attachListeners(){
  $('td').click(function(event){
    doTurn(event);
  })

  $("#previous").click(function(event) {
    oldGames();
  });

  $("#save").click(function(event) {
    saveGame();
  });

}

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

function saveGame(){
  currentBoard = $.map($('td'), function(cell, index){
    return $(cell).text();});

  $.post({url: '/games'}, {state: currentBoard})
  .done(function(game){message("game successfully saved")});
}



function doTurn(event){
  updateState(event);
  if (checkWinner() === true) {resetBoard();}
  else {
  turn += 1;}
}

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
    return true;
  }
  else if (winner.length > 0) {
    message("Player " + player() + " Won!");
    return true;
  }
  else { return false;}
}


function message(string) {
  $('#message').text(string);
}

$('document').ready(function(){

  attachListeners();

});
