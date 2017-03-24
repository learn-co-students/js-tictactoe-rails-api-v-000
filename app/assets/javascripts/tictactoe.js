var turn = 0; 
var winningCombos = [ [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0], [2,1], [2,2]], [[0,0],[1,1],[2,2]], [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[2,0],[1,1],[0,2]] ];  
var board = getCurrentBoard(); 

function getCurrentBoard() {
  var currentBoard = [[0, 0, 0],[0, 0, 0],[0, 0, 0]]; 
  for (var i = 0; i < currentBoard.length; i++) {
    for (var j = 0; j < currentBoard[i].length; j++) {
      currentBoard[i][j] = $('[data-x="'+ i + '"][data-y="'+ j + '"]').html();  
    }
  }
  return currentBoard; 
}

function resetBoard() {
  var dimension = 3; 
  for (var i = 0; i < dimension; i++) {
    for (var j = 0; j < dimension; j++) {
      $('[data-x="'+ i + '"][data-y="'+ j + '"]').html(''); 
    }
  }
  return; 
}

var isEmpty = function(space) {
  if (space == "X"){  
    return false; 
  } else if (space == "O") {
    return false;  
  } else {
    return true;  
  }
}

var checkForWin = function(combo) {
  var currentBoard = getCurrentBoard(); 
  for (var i = 0; i < combo.length; i++) {
    var currentSquare = currentBoard[combo[i][0]][combo[i][1]]; 
    if (currentSquare == player()) {
      continue;  
    } else {
      return false;  
    }
  }   
  return true; 
}

function tie() {
  return (!checkWinner() && boardIsFull()); 
}

function checkForTie() {
  if ( tie() ) {
    message("Tie game"); 
    return true; 
  }
  return false; 
}

var boardIsFull = function() {
  var board = getCurrentBoard(); 
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (isEmpty(board[i][j])) {
        return false;  
      }
    } 
  }
  return true; 
}

var attachListeners = function() {
  $('tbody').on("click", function(e) {
    doTurn(e);  
  }); 
}

var doTurn = function(event) {
  updateState(event); 
  if (checkWinner() || checkForTie() ){ 
    resetBoard(); 
    turn = 0; 
   } else {
    turn++; 
   } 
}

var checkWinner = function() {
  for (var i = 0; i < winningCombos.length; i++) {
    if (checkForWin(winningCombos[i])) {
      message("Player " + player() + " Won!"); 
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
