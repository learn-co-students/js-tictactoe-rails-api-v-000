$(function() {
    attachListeners();
});

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
  let turn = 0;
  updateState(event);
  checkWinner();
  turn ++;
}

function player(turn) {
  return  (turn % 2 === 0) ? "x" : "O";
}
