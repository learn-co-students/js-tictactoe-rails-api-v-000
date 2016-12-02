var turn = 0;
var winningCombinations = [ [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6] ];
var gameBoard = [];
var gameOver = false;
var currentGame = 0;

var getState = function(){
  var state = $("td");
  var board = [];
  for(var i=0;i<state.length;i++){
    board.push(state[i].outerText);
  }
   gameBoard = board;
};

var player = function(){
  if(turn % 2 === 0){
    return 'X';
  } else {
    return 'O';
  }
};

var message = function(msg){
  $("#message").text(msg);
};

var checkWinner = function(){
  var called = false;
  for(var i=0;i<winningCombinations.length;i++){
    var a=winningCombinations[i][0];
    var b=winningCombinations[i][1];
    var c=winningCombinations[i][2];
    if( gameBoard[a] === "X" && gameBoard[b] === "X" && gameBoard[c] === "X"){
      called = true;
      message("Player X Won!");
      break;
    }else if (gameBoard[a] === "O" && gameBoard[b] === "O" && gameBoard[c] === "O") {
      called = true;
      message("Player O Won!");
      break;
    }
  }
  if(called===false){
    return false;
  }else{
    gameOver = true;
  };
};

var tie = function(){
  if(turn >= 9){
    message("Tie game");
    gameOver = true;
  }
}

var clearBoard = function(){
  if(gameOver === true){
    saveGames(true);
    $('td').html("");
    turn = 0;
    gameOver = false;
    currentGame = 0;
  }
}

var updateState = function(event){
  debugger;
  if($(event.target).text() === ""){
    $(event.target).text(player());
  }
};

var doTurn = function(event){
 updateState(event);
 getState();
 checkWinner();
 getTurnCount();
 tie();
};

var allGames = function(){
  $('#games').html("");
  $.get("/games", function(data) {
    var games = data["games"];
    games.forEach(function(game){
      $('#games').append("<li " + "data-gameid=" + game.id + ">" + game.state + "</li>");
    });
  });
}

var saveGames = function(reset){
  var url;
  var method;
  if(currentGame === 0){
    url = "/games";
    method = "post";
  } else {
    url = "/games/" + currentGame;
    method = 'PATCH';
  }
  $.ajax({
     url: url,
     method: method,
     dataType: "json",
     data: {state: gameBoard},
     success: function(response) {
       if(reset){
         current = 0;
       } else{
         currentGame = response.game.id;
       }
     }
   })
}

var switchGame = function(event){
  rawHTML = event.target.outerHTML;
  getIdFromHTML(rawHTML);
  gameBoard = event.target.textContent.split(",");
  loadBoard();
  getTurnCount();
  checkWinner();
  tie();
  clearBoard();
};

var loadBoard = function(){
  $('td').html("");
    for(var i=0;i<9;i++){
      var boardValue = gameBoard[i];
      $( "td" ).each( function( index, element ){
        if(element.dataset.x === "0" && element.dataset.y === "0" && i===0){
          $( this ).text(boardValue);
        } else if(element.dataset.x === "1" && element.dataset.y === "0" && i===1){
          $( this ).text(boardValue);
        } else if(element.dataset.x === "2" && element.dataset.y === "0" && i===2){
          $( this ).text(boardValue);
        } else if(element.dataset.x === "0" && element.dataset.y === "1" && i===3){
          $( this ).text(boardValue);
        } else if(element.dataset.x === "1" && element.dataset.y === "1" && i===4){
          $( this ).text(boardValue);
        } else if(element.dataset.x === "2" && element.dataset.y === "1" && i===5){
          $( this ).text(boardValue);
        } else if(element.dataset.x === "0" && element.dataset.y === "2" && i===6){
          $( this ).text(boardValue);
        } else if(element.dataset.x === "1" && element.dataset.y === "2" && i===7){
          $( this ).text(boardValue);
        } else if(element.dataset.x === "2" && element.dataset.y === "2" && i===8){
          $( this ).text(boardValue);
        }
      });
    }
};

var getTurnCount = function(){
  turn = 0;
  for(var i=0;i<gameBoard.length;i++){
    if(gameBoard[i] === "X" || gameBoard[i] === "O"){
      turn++;
    }
  }
};

var getIdFromHTML = function(rawHTML){
  var tighten = rawHTML.slice(17,21).split("");
  var id = [];
  for(var i=0;i<tighten.length;i++){
    if(!isNaN(tighten[i])){
      id.push(tighten[i]);
    }
  }
  currentGame = parseInt(id.join(""));
};

var attachListeners = function(){
  $('td').on('click', function(event){
    doTurn(event);
    clearBoard();
  });
  $('#previous').on('click', function(){
    allGames();
  });
  $("#save").on("click", function(){
    saveGames();
  });
  $("#games").on("click", function(event){
    switchGame(event);
  });
};

$(document).ready(function(){
    attachListeners();
})
