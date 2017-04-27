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
    saveGame()
  });
  $("#previous").click(function(event){
    showPreviousGames(event)
  });
};

function doTurn(event){
  updateState(event);
  checkWinner();
  checkTie();
  turn += 1;
  $("#turns").text(turn);
  saveGame();
};

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
  saveGame();
}
  
function checkWinner(){
  var b = [];
  var board = $("td")
   for (i = 0; i <=8; i++) {
    b.push(board[i].innerText)
  }
  if (b[0] === b[1] && b[0] === b[2] && b[0] !== ""){
    message("Player " + b[0] + " Won!");
    return true;
  }  
  if (b[3] === b[4] && b[3] === b[5] && b[3] !== ""){
    message("Player " + b[3] + " Won!");
    return true;
  } 
  if (b[6] === b[7] && b[6] === b[8] && b[6] !== ""){
    message("Player " + b[6] + " Won!");
    return true;
  }
  if (b[0] === b[3] && b[0] === b[6] && b[0] !== ""){
    message("Player " + b[0] + " Won!");
    return true;
  }
  if (b[1] === b[4] && b[1] === b[7] && b[1] !== ""){
    message("Player " + b[1] + " Won!");
    return true;
  }
  if (b[2] === b[5] && b[2] === b[8] && b[2] !== ""){
    message("Player " + b[2] + " Won!");
    return true;
  }
  if (b[0] === b[4] && b[0] === b[8] && b[0] !== ""){
    message("Player " + b[0] + " Won!");
    return true;
  }
  if (b[2] === b[4] && b[2] === b[6] && b[2] !== ""){
    message("Player " + b[2] + " Won!");
    return true;
  } else {
    return false;
  }
};

function checkTie(){
  if(turn === 8 && checkWinner() === false){
    message("Tie game");
    return true;
   }
}

function message(msg){
  $("#message").text(msg);
  resetTurn();
  resetBoard();
  resetCurrentGame()
  saveGame();
}

function resetBoard() {
  $("td").html("");
}

function resetTurn(){
  turn = 0;
}

function resetCurrentGame(){
  currentGame = undefined;
}

function showPreviousGames(){
  // $("#games").html("");
  $.getJSON("/games", function(response) {
  let games = response.games
    for(var l = games.length, i = 0; i < l; i++) {
      var id = games[i].id
      $("#games").append("<li><button class='load_previous_game '>" + id + "</button></li>");
    };
  });
}

function loadPreviousGame() {
  $(".load_previous_game").on("click", function(data){
    let game_id = $(this)[0].innerText;
    $.get('/games/' + game_id, function(previous_game){
    var state = previous_game.state
    for(var i = 0; i <= 8; i++) {
      let cell = $("td")[i];
      cell.innerText = (state[i]);
      }
    })
  })
}

var currentState = function() {
  var state = []
  $("td").each(function(i) {
    state.push($(this).text())
  })
  return state;
}

function saveGame(){
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
      if(resetBoard) {
        currentGame = undefined;
      } else {
        currentGame = data.game.id;
      }
    }
  })
}

$(function(){
  attachListeners();
});