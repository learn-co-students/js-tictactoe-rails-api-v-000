var turn = 0; 
var winningCombos = [ [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0], [2,1], [2,2]], [[0,0],[1,1],[2,2]], [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[2,0],[1,1],[0,2]] ];  
var board = getCurrentBoard(); 
var currentGame; 

function getCurrentBoard() {
  var currentBoard = [[0, 0, 0],[0, 0, 0],[0, 0, 0]]; 
  for (var i = 0; i < currentBoard.length; i++) {
    for (var j = 0; j < currentBoard[i].length; j++) {
      currentBoard[i][j] = $('[data-x="'+ i + '"][data-y="'+ j + '"]').html();  
    }
  }
  return currentBoard; 
}

function resetGame() {
  $("td").html(""); 
  turn = 0; 
  currentGame = 0; 
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
  $("#games").click(function(event) {
    var state = parseState(event); 
    swapGame(state, getGameId(event)); 
  }); 
  $("#save").click(function(event) {
    save();  
  }); 
  $("#previous").click(function(event) {
    getAllGames();  
  }); 
}

function parseState(event) {
  return $(event.target).data("state").split(","); 
}
function swapGame(state, id) {
  placeMarks(state); 
  currentGame = id; 
  turn = findTurn(state); 
}
function getGameId(event){
  return $(event.target).data("gameid")
}
function getAllGames() {
  $.getJSON("/games").done(function(response) {
    showGames(response.games);  
  }) 
}
function placeMarks(marks){
  $("td").each(function(i) {
    $(this).text(marks[i]);  
  }); 
}
function getMarks() {
  var marks = []
  $("td").each(function(i) {
    marks.push($(this).text()) 
  })
  return marks; 
}
function findTurn(state) {
  var turn = 0; 
  state.forEach(function(item) {
    if (item != "") {
      turn += 1;  
    } 
  })
  return turn; 
}
function showGames(games) {
  var dom = $(); 
  games.forEach(function(game) {
    dom = dom.add(showGame(game));  
  })
  $("#games").html(dom); 
}
function showGame(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id })
}
function save(resetGame) {
  var url, method; 
  if (currentGame) {
    url = "/games/" + currentGame; 
    method = "PATCH"; 
  } else {
    url = "/games"; 
    method = "POST"; 
  }

  $.ajax({
    url: url, 
    method: method, 
    dataType: "json", 
    data: {
      game: {
        state: getMarks(),  
      }, 
    }, 
    success: function(data) {
      if(resetGame) {
        currentGame = undefined; 
      } else {
        currentGame = data.game.id; 
      } 
    }
  })
}

var doTurn = function(event) {
  updateState(event); 
  if (checkWinner() || checkForTie() ){ 
    save(true); 
    resetGame(); 
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
  if (isEmpty($(e.target).html()) ) {
    $(e.target).html(player()); 
  }
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
