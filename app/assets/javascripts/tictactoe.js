// EACH CELL IS A <td>

var turn = 0;
var currentGame;

var winningCombinations = [
[[0,0],[1,0],[2,0]], 
[[0,1],[1,1],[2,1]], 
[[0,2],[1,2],[2,2]], 
[[0,0],[1,1],[2,2]], 
[[0,0],[0,1],[0,2]], 
[[2,0],[2,1],[2,2]], 
[[1,0],[1,1],[1,2]], 
[[2,0],[1,1],[0,2]]
]

var player = function() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

var save = function() {

}

var attachListeners = function() {
  $("td").on("click", function(event){
    doTurn(event);
  });
  $("#save").on("click", function() {
    save();
  });
  $("#previous").on("click", function() {
    previousGame();
  })
}









