var turn = 0;
var currentGame;
var winningCombos = [
										//columns
                    [0,3,6],[1,4,7],[2,5,8],
                    //rows
                    [0,1,2],[3,4,5],[6,7,8],
                    //diagonal
                    [0,4,8],[2,4,6]
                  ];

function attachListeners(){
  $('body').on('click', 'td', function(e){
    doTurn(e);
  });
  $("#save").on('click', function(){
    saveGame();
  });
  $('#previous').on('click', function(){
    showPreviousGame();
  });
};

function doTurn(e){
  updateState(e);
  if (checkWinner() || tie()){
    saveGame();
    resetBoard();
  } else {
    turn = setTurn();
  }

}

function tie(){
  var currentBoard = getBoard();
  var filtered = currentBoard.filter(findEmpty);
  if (filtered.length == 0){
    message("Tie game");
    return true;
  }
  return false;
}

function findEmpty(cell){
  return cell == '';
}

function resetBoard(){
  $('td').each(function(){
    $(this).text('');
    turn = setTurn();
  });
}

function setTurn(){
  var board = getBoard();
  var turnCount = 0;
  for(var i = 0; i < 9; i++){
    var addTurn = board[i] == "" ? 0 : 1;
    turnCount += addTurn;
  };
  return turnCount;
}

function checkWinner(){
  var currentBoard = getBoard();
  for(var i = 0; i < 8; i++){
    var cellToCheck = [];
  	for(var j = 0; j < 3; j++){
      cellToCheck.push(currentBoard[winningCombos[i][j]]);
  	}
  	if (cellToCheck.join().includes("X,X,X")){
      message("Player X Won!");
      return true;
  	} else if (cellToCheck.join().includes("O,O,O")){
      message("Player O Won!");
      return true;
  	}
  }
  return false;
}

function saveGame(){
    var currentBoard = getBoard();
    var params = {game: {state: currentBoard}};

    var url, method;
    if(currentGame) {
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
    data: params,
    success: function(data) {
      currentGame = data.id;
      // window.location.replace('/games/'+currentGame);
      console.log("Game saved as: Game #" + data.id);
    }
  });
}

function player(){
  var token = turn % 2 == 0 ? 'X' : 'O';
  return token;
}

function message(m){
  $("#message").text(m);
  return true;
}

function getBoard(){
  var board = [];
  $('td').each(function(index){
  	board.push($(this).text());
  });
  return board;
}

function updateState(e){
  var cell = $(e.target).text();
  if(cell != "X" && cell != "O"){
    $(e.target).text(player());
  } else {
    console.log("Can't go there.");
  }
}

function showBoard(board){
  $('#games').text(' ');
  $('td').each(function(index){
    if(board == null){
      $(this).text('');
    } else {
      $(this).text(board[index]);
    }
  });
  setTurn();
}

function showPreviousGame(){
    $.getJSON('/games', function(data){
      var games = data["games"];
      var len = games.length;
      var gamesID = [];
      var html = "";
      for(var i = 0; i < len; i++){
        html += "<ul class='nav'>"
        html += "<li class='games' data-id='";
        html += games[i].id + "'> Game #" + games[i].id + "</li>";
        html += "</ul>";
      }
      console.log("Outside Loop: " + html);
      $('#games').append(html);
      showPreviousOnBoard();
    });
}

function showPreviousOnBoard(gameId){
  if(gameId){
      $.get('/games/'+ gameId +'.json', function(data){
        message("Displaying game " + gameId);
        showBoard(data["state"]);
        currentGame = gameId;
        turn = setTurn();
      })
  } else {
    $('.games').on('click', function(){
      var gameID = $(this).data("id");
      $.get('/games/'+ gameID +'.json', function(data){
        message("Displaying game " + gameID);
        showBoard(data["state"]);
        currentGame = gameID;
        turn = setTurn();
      })
    });
  }
}
