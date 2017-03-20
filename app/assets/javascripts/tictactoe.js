var turn = 0;
var winCombinations = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[1,1],[2,2]], [[0,0],[0,1],[0,2]], [[2,0],[2,1],[2,2]], [[1,0],[1,1],[1,2]], [[2,0],[1,1],[0,2]]]

var checkWinner = function() {
  for(let i=0; i<winCombinations.length; i++) {
    // TODO: work out checkWinnder logic
    return false;
  }
  return true;
}

var tie = function() {
  // TODO: work out tie logic
  return false;
}

var player = function() {
  if(turn % 2 == 0) {
    return 'X';
  } else {
    return 'O';
  }
}

var updateState = function(event) {
  $(event.target).html(player());
}

var message = function(message) {
  $("#message").html(message);
}

var doTurn = function(event) {
  updateState(event);
  if(checkWinner() || tie()) {
    console.log("winner or tie");
  } else {
    turn += 1;
  }

}

var attachListeners = function() {
  $("tbody").click(function(event) {
    doTurn(event);
  });
}

$(function() {
  attachListeners();
});
