var turn = 0;
var currentGame;
var winCombinations = [
                        [[0,0],[1,0],[2,0]],
                        [[0,1],[1,1],[2,1]],
                        [[0,2],[1,2],[2,2]],
                        [[0,0],[1,1],[2,2]],
                        [[0,0],[0,1],[0,2]],
                        [[2,0],[2,1],[2,2]],
                        [[1,0],[1,1],[1,2]],
                        [[2,0],[1,1],[0,2]]
                      ];


var resetBoard = function() {
  $("td").each(function(){
    this.innerHTML = ""
  });
  turn = 0;
  currentGame = null;
}

var checkWinner = function() {
  for(let i=0; i<winCombinations.length; i++){
      var x0 = winCombinations[i][0][0];
      var y0 = winCombinations[i][0][1];
      query0 = $('[data-x="' + x0 + '"][data-y="' + y0 + '"]');
      var x1 = winCombinations[i][1][0];
      var y1 = winCombinations[i][1][1];
      query1 = $('[data-x="' + x1 + '"][data-y="' + y1 + '"]');
      var x2 = winCombinations[i][2][0];
      var y2 = winCombinations[i][2][1];
      query2 = $('[data-x="' + x2 + '"][data-y="' + y2 + '"]');

      if((query0[0].innerHTML == query1[0].innerHTML) &&
          query1[0].innerHTML == query2[0].innerHTML &&
          query0[0].innerHTML != "") {
        message(`Player ${player()} Won!`)
        return true
      }
  }
  return false;
}

var checkTie = function () {
  returnVal = true
  $("td").each(function(){
    if(this.innerHTML == ""){
      returnVal =  false;
    }
  });

  if(returnVal == true) {
    message("Tie game");
  }
  return returnVal
}

var player = function() {
  if(turn % 2 == 0) {
    return 'X';
  } else {
    return 'O';
  }
}

var updateState = function(event) {
  if(($(event.target).html() == "X") || ($(event.target).html() == "O")) {
   return false;
 }
 $(event.target).text(player());
 return true;
}

var message = function(message) {
  $("#message").html(message);
}

var doTurn = function(event) {
  if(!updateState(event)) {
    message("Invalid move try again.");
    attachListeners();
  }
  if(checkWinner() || checkTie()) {
    save();
    resetBoard();
    console.log("winner or tie");
  } else {
    turn++;
    console.log(turn);
  }
}

var attachListeners = function() {
    //Table (board) event listener
    $("tbody").click(function(event) {
        doTurn(event);
    });

    //Save button event listener
    $("#save").click(function(event) {
      save();
    });

    //Show Previous button event listener
    $("#previous").click(function(event) {
      getGames();
    })
}

$(function() {
  attachListeners();
});

//Returns array containing board representation
var getBoard = function() {
  board = [];
  $("td").each(function(){
    board.push($(this).text());
  })
  return board;
}

// AJAX Funcs
var save = function() {
  var url;
  var method;

  //If this game was previously saved update it
  if(currentGame) {
    url = "/games/" + currentGame;
    method = "PATCH";
  //Otherwise create new save game
  } else {
    url = '/games';
    method = "POST";
  }
  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: {
        state: getBoard()
      }
    },
    success: function(data) {
      if(currentGame != null){
        currentGame = data.game.id;
      }
    }
  })
}

var getGames = function() {
  $.ajax({
    url: "/games",
    method: "GET",
    success: function(data) {
      //If no games exist display message
      if(data.games.length <= 0) {
        HTMLString = "No games in the DOM";
      }
      //Otherwise create a new list item with each game id
      else {
        HTMLString = "";
        for(let i=0; i<data.games.length; i++) {
          HTMLString += `<li>${data.games[i].id}</li>`;
        }
        HTMLString += "";
      }
      $("#games").html(HTMLString);
    }
  });
}
