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

var checkWinner = function() {

};

var checkTie = function() {

}

var resetGame = function() {

}