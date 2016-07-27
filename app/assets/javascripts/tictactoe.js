var turn = 0;

var currentGame = 0;

var winningCombos = [
[[0,0],[1,0],[2,0]], 
[[0,1],[1,1],[2,1]], 
[[0,2],[1,2],[2,2]], 
[[0,0],[1,1],[2,2]], 
[[0,0],[0,1],[0,2]], 
[[2,0],[2,1],[2,2]], 
[[1,0],[1,1],[1,2]], 
[[2,0],[1,1],[0,2]]];

var message = function(str) {
  $("#message").html(str);
}

var attachListeners = function() {

}

var doTurn = function() {

}

var updateState = function(e) {
  $(e.target).text(player());
};

var player = function() {
  return (turn % 2) == 0 ? "X" : "O";
}

var checkWinner = function() {
  for (var i = 0; i < winningCombos.length; i++) {
    tokens = [];
    for (var j = 0; j < winningCombos[i].length; j++) {
      var x = winningCombos[i][j][0];
      var y = winningCombos[i][j][1];
      var selector = $('[data-x="' + x + '"][data-y="' + y + '"]');
      tokens.push(selector.text());
    };
    if (tokens.every(function(e){return (e === player())})){
      return message( "Player " + player() + " Won!");
    };
  };
  return false
};


var checkTie = function() {
  if (turn >= 9) {
    message("Tie game");
  }
}

var resetGame = function() {

}