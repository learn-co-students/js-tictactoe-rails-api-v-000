$(function() {
    attachListeners();
});

var turn = 0;
function attachListeners() {
  $('tbody').click(function(event){
    doTurn(event);
  });

  $('#previous').click(function(event){
    getAllGames();
  });

  $('#save').click(function(event){
    save();
  });

  $('#previous').click(function(event){
    getAllGames();
  });
}

function doTurn() {

  updateState(event);
  //checkWinner();
    turn++;
}

function player() {
  debugger
  return (turn % 2 === 0) ? "x" : "O";
}

function updateState(event) {
  $(event.target).html(player())
}
