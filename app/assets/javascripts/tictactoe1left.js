var turn = 0;
var currentGame; 

function turns(){
  var cells = $("td")
  for (var i = 8; i >= 0; i--){
    if (cells[i].innerText !== ""){
      turn+=1;
    }
  $("#turns").text(turn);
  }
}

function attachListeners(){ 
  $("td").click(function(event) {
    doTurn(event.target);
  });
  $("#save").click(function(event){
    save();
  });
  $("#previous").click(function(event){
    showPreviousGames(event)
  });
  $(".previous_game").click(function(event){
    loadPreviousGame(event)
    preventDefault(event);
  });
};

function attachListenersForPreviousGames(){
  $(".previous_game").click(function(event){
    loadPreviousGame(event)
  }); 
}
 
var doTurn = function(event){
  updateState(event);
  if(checkWinner() || checkTie() ) {
    save(resetGame);
    resetGame();
  } else {
    turn += 1;
    $("#turns").text(turn);
  }
}

function player(){ 
  if (turn %2 === 0){
    return "X";
  } else { 
    return "O";
  }
}

function updateState(event){
  var token = player();
  $(event).html(token);
}
  
function checkWinner(){
  var b = [];
  var board = $("td")
   for (i = 0; i <=8; i++) {
    b.push(board[i].innerText)
  }
  if (b[0] === b[1] && b[0] === b[2] && b[0] !== ""){
    message("Player " + b[0] + " Won!");
    turn = 0;
    return true;
  }  
  if (b[3] === b[4] && b[3] === b[5] && b[3] !== ""){
    message("Player " + b[3] + " Won!");
    turn = 0;
    return true;
  } 
  if (b[6] === b[7] && b[6] === b[8] && b[6] !== ""){
    message("Player " + b[6] + " Won!");
    turn = 0;
    return true;
  }
  if (b[0] === b[3] && b[0] === b[6] && b[0] !== ""){
    message("Player " + b[0] + " Won!");
    turn = 0;
    return true;
  }
  if (b[1] === b[4] && b[1] === b[7] && b[1] !== ""){
    message("Player " + b[1] + " Won!");
    turn = 0;
    return true;
  }
  if (b[2] === b[5] && b[2] === b[8] && b[2] !== ""){
    message("Player " + b[2] + " Won!");
    turn = 0;
    return true;
  }
  if (b[0] === b[4] && b[0] === b[8] && b[0] !== ""){
    message("Player " + b[0] + " Won!");
    turn = 0;
    return true;
  }
  if (b[2] === b[4] && b[2] === b[6] && b[2] !== ""){
    message("Player " + b[2] + " Won!");
    turn = 0;
    return true;
  } else {
    return false;
  }
};

function checkTie(){
  if(turn === 8 && checkWinner() === false){
    message("Tie game");
    save(resetGame);
    resetGame();
    return true;
   }
}

function message(msg){
  $("#message").text(msg);
  save(resetGame);
  resetGame();
}

var resetGame = function(){
  $("td").html("");
  turn = 0;
  currentGame = 0;
}

function showPreviousGames(){
  $("#games").html("");
  $.getJSON("/games", function(response) {
  let games = response.games
    for(var l = games.length, i = 0; i < l; i++) {
      var id = games[i].id
      $("#games").append("<li><button class='previous_game'>" + id + "</button></li>");
    };
  attachListenersForPreviousGames();
  });
}

function loadPreviousGame(game) {
  var game_id = event.currentTarget.firstChild.data
  $.get('/games/' + game_id, function(previous_game){
  currentGame = game_id;
  var state = previous_game.game.state
  let cells = $("td");
  for(var i = 0; i <= 8; i++) {
    cells[i].innerText = (state[i]);
    }
  })
}

var currentState = function() {
  var state = []
  $("td").each(function(i) {
    state.push($(this).text())
  })
  return state;
}

function save(resetGame){
  var url, method;
  if(currentGame) {
    url = "/games/" + currentGame
    method = "PATCH"
  } else {
    url = "/games"
    method = "POST"
  }

  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: {
        state: currentState()
      }
    },
    success: function(data) {
      if(resetGame) {
        currentGame = 0;
      } else {
        currentGame = data.game.id;
      }
      // currentGame = data.game.id;
    }
  })
}



// var save = function(resetGame) {
//   var url, method;
//   if(currentGame) {
//     url = "/games/" + currentGame
//     method = "PATCH"
//   } else {
//     url = "/games"
//     method = "POST"
//   }

//   $.ajax({
//     url: url,
//     method: method,
//     dataType: "json",
//     data: {
//       game: {
//         state: currentState()
//       }
//     },
//     success: function(data) {
//       if(resetGame) {
//         currentGame = undefined;
//       } else {
//         currentGame = data.game.id;
//       }
//     }
//   })
// }

$(function(){
  attachListeners();
});