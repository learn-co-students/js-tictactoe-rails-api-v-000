var turn = 0;
var won = false;
var over = false;
var currentGame;

var win_combo = [
    [$("[data-x=0][data-y=0]").text(), $("[data-x=0][data-y=1]").text(), $("[data-x=0][data-y=1]").text()],
    [$("[data-x=1][data-y=0]").text(), $("[data-x=1][data-y=1]").text(), $("[data-x=1][data-y=2]").text()],
    [$("[data-x=2][data-y=0]").text(), $("[data-x=2][data-y=1]").text(), $("[data-x=2][data-y=2]").text()], 
    [$("[data-x=0][data-y=0]").text(), $("[data-x=1][data-y=0]").text(), $("[data-x=2][data-y=0]").text()],
    [$("[data-x=0][data-y=1]").text(), $("[data-x=1][data-y=1]").text(), $("[data-x=2][data-y=1]").text()],
    [$("[data-x=0][data-y=2]").text(), $("[data-x=1][data-y=2]").text(), $("[data-x=2][data-y=2]").text()],
    [$("[data-x=0][data-y=0]").text(), $("[data-x=1][data-y=1]").text(), $("[data-x=2][data-y=2]").text()],
    [$("[data-x=0][data-y=2]").text(), $("[data-x=1][data-y=1]").text(), $("[data-x=2][data-y=0]").text()]
  ]

function attachListeners(event){
  $("td").click(function(event){
    doTurn(event);
  });

  $("#previous").click(function(event) {
     getGames();
  });

  $("#save").click(function(event) {
     saveGame();
  });

  $("#games").on("click", function(event){
    var state = $(event.target).data("state").split(",")
    switchGame(state, $(event.target).data("gameid"))
  });

  $("#previous").click(function() {
    getGames();
  });

}

var switchGame = function(state, id) {
  $("td").each(function(i) {
    $(this).text(state[i]);
  })

  currentGame = id;
}


function checkTokenX(cell){
  return cell === "X" 
}

function checkTokenO(cell){
  return cell === "O" 
}

function doTurn(event){
  updateState(event);

  checkWinner();

  if(over === false){
    turn += 1;
  }
}

function getGames(){
   $.get("/games", function(data) {

    games = data["games"];

    $("#games").text("");

    
    games.forEach(function(game){
      $("#games").append("<li data-gameid=" + game["id"] + " data-state=" + game["state"] + ">" + game["id"] + "</li>");
    });

  });
}

function saveGame(resetGame) {


  var url, method;

  if(currentGame) {
    url = "/games/" + currentGame;
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
        state: getState()
      }
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

var getState = function() {
  var state = []
  $("td").each(function() {
    state.push($(this).text())
  })
  return state;
}


function full(win_combo){
  for(var i = 0; i < win_combo.length; i++){
    for(var j = 0; j < win_combo[i].length; j++){
      if(win_combo[i][j] === ""){
        return false;
      }
    }
  }
  return true;
}

function reset(){
  $("td").each(function(){
      $(this).text("");
  });

  currentGame = 0; 
}


function checkWinner(event){

  won = false;
  over = false;

  var win_combo = [
    [$("[data-x=0][data-y=0]").text(), $("[data-x=0][data-y=1]").text(), $("[data-x=0][data-y=2]").text()],
    [$("[data-x=1][data-y=0]").text(), $("[data-x=1][data-y=1]").text(), $("[data-x=1][data-y=2]").text()],
    [$("[data-x=2][data-y=0]").text(), $("[data-x=2][data-y=1]").text(), $("[data-x=2][data-y=2]").text()], 
    [$("[data-x=0][data-y=0]").text(), $("[data-x=1][data-y=0]").text(), $("[data-x=2][data-y=0]").text()],
    [$("[data-x=0][data-y=1]").text(), $("[data-x=1][data-y=1]").text(), $("[data-x=2][data-y=1]").text()],
    [$("[data-x=0][data-y=2]").text(), $("[data-x=1][data-y=2]").text(), $("[data-x=2][data-y=2]").text()],
    [$("[data-x=0][data-y=0]").text(), $("[data-x=1][data-y=1]").text(), $("[data-x=2][data-y=2]").text()],
    [$("[data-x=0][data-y=2]").text(), $("[data-x=1][data-y=1]").text(), $("[data-x=2][data-y=0]").text()]
  ]

  for(var i = 0; i < win_combo.length; i++){
    if(win_combo[i].every(checkTokenX)){
      message("Player X Won!");
      won = true;
      SaveAndReset();
    }
    else if(win_combo[i].every(checkTokenO)){
      message("Player O Won!");
      won = true;
      SaveAndReset();
    }
  }

  if(won === false && full(win_combo) == true){
    message("Tie game");
    SaveAndReset();
  }

  return false;
}

function SaveAndReset(){
  turn = 0;
  over = true; 
  saveGame(true); 
  reset();
}


function updateState(event){

  var token = player();

  $(event.target).text(token);
}

function player(){

  if(turn % 2 === 0){
    return "X";
  }
  else{
    return "O";
  }
}

function message(message){
  $("#message").html(message);
}



