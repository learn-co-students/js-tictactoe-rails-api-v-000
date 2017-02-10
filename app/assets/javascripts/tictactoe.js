var turn = 0; 
var winningCombos = [ [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0], [2,1], [2,2]], [[0,0],[1,1],[2,2]], [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[2,0],[1,1],[0,2]] ];  

var checkForWin = function(combo) {
   

}

var tie = function() {
  if checkWinner()
}

var attachListeners = function() {
  $('tbody').on("click", function(e) {
    doTurn(e);  
  }); 
}

var doTurn = function(event) {
  updateState(event); 
  checkWinner(); 
  turn++; 
}

var checkWinner = function() {
  for (var i = 0; i < winningCombos.length; i++) {
    if (checkForWin(winningCombos[i])) {
      message("Player " + player() + "Won!"); 
      return true;  
    } 
  }
  return false; 
}

var updateState = function(e) {
  $(e.target).html(player());  
}

var player = function() {
  if ((turn % 2) == 0) {
    return "X"; 
  } else {
    return "O"; 
  }
}

var message = function(string) {
  $('#message').text(string); 
}

$(function() {
  attachListeners(); 
})
