$(function(){
  attachListeners();
})

var turn = 0;
var winningCombos = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[1,1],[2,2]], [[0,0],[0,1],[0,2]], [[2,0],[2,1],[2,2]], [[1,0],[1,1],[1,2]], [[2,0],[1,1],[0,2]]];
var boardPositions = [[0,0], [1,0], [2,0], [0,1], [1,1], [2,1], [0,2], [1,2], [2,2]];
var currentGame = undefined;

var attachListeners = function(){
  $('td').on("click", function(event){
    doTurn(event);
  });
  $('#previous').on("click", function(){
    getAllGames();
  });
  $('#save').on("click", function(){
    saveGame();
  });
  $("#games").on("click", '[data-gameid]', function(){
    // console.log(this.dataset["gameid"]);
    var id = ($(this).data("gameid"));
    var url = "/games/" + id;
    $.getJSON(url, function(data){
      // console.log(data);
      currentGame = data["game"]["id"];
      var oldBoard = (data["game"]["state"]);
      console.log(oldBoard);
      turn = $('td').text().length;
      for(i = 0; i < oldBoard.length; i++){
        $("[data-x='" + boardPositions[i][0] + "'][data-y='" + boardPositions[i][1] + "']").text(oldBoard[i]);
      }
    })
  })
}

var doTurn = function(event){
  updateState(event);
  turn += 1;
  checkWinner() || checkTie();
}

var player = function(){
  if (turn % 2 == 0){
    return "X";
  } else {
    return "O";
  };
};

var updateState = function(event){
  $(event.target).html(player());
}

var isTaken = function(coordinates){
  if ($("[data-x='" + coordinates[0] + "'][data-y='" + coordinates[1] + "']").html() != ""){
    return $("[data-x='" + coordinates[0] + "'][data-y='" + coordinates[1] + "']").html();
  }
}

var threeInARow = function(set){
  if (isTaken(set[0]) && isTaken(set[1]) && isTaken(set[2])){
    return true;
  }
}

var tokensMatch = function(set){
  if (threeInARow(set) && isTaken(set[0]) == isTaken(set[1]) && isTaken(set[1]) == isTaken(set[2])){
    return true;
  }
}

var checkWinner = function(){
  $.each(winningCombos, function(index, winningArray){
    if (threeInARow(winningArray) && tokensMatch(winningArray)){
      message("Player " + isTaken(winningArray[0]) + " Won!");
      resetBoard();
    }
  })
  return false;
}

var resetBoard = function(){
  saveGame();
  turn = 0;
  currentGame = undefined;
  $("td").each(function(index, data){
    data.innerHTML = "";
  })
}

var checkTie = function(){
  if (turn === 9){
    if(checkWinner()){
      return false;
    } else {
      message("Tie game");
      resetBoard();
    }
  }
}

var getAllGames = function(){
  $.getJSON("/games", function(data){
    if(data["games"].length > 0){
      var gameList = "";
      for(i = 0; i < data["games"].length; i++){
        gameList += ("<li data-gameid=" + data["games"][i]["id"] + ">" + data["games"][i]["id"] + "</li>");
      }
      $('#games').html(gameList);

    };
  })
}

// var getChosenGame = function(){
  // console.log($(event.target).data("gameid"));
  // event.preventDefault();
// 
// }

var currentState = function(){
  var b = $.map(boardPositions, function(p, index){
    return $("[data-x='" + p[0] + "'][data-y='" + p[1] + "']").html();
  });
  return b;
}

var saveGame = function(){
  var s = currentState();
  // if we're saving the game in progress (which has already been saved):
  if (currentGame){
    $.ajax({
      url: "/games/" + currentGame,
      data: {
        game: {state: s}
      },
      type: "PATCH",
      dataType: "json",
      success: function(response){
        console.log(JSON.stringify(response));
      }
    })
    // if we're saving a new instance of a game:
  } else {
    $.ajax({
      type: "POST",
      url: "/games",
      data: {
        game: {state: s}
      },
      success: function(data){
        if ($('#message').html() == ""){
          currentGame = data["game"]["id"];
        } else {
          currentGame = undefined;
        }
      },
      dataType: "json"
    });

  }
}

var message = function(string){
  $('#message').html(string);
}
