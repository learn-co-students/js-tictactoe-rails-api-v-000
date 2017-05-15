var turn = 0;
var currentGame;

function matchValues(values){
  if ( values[0] === player() && values[1] === player() && values[2] === player() ){
    return true;
  } else if ( values[3] === player() && values[4] === player() && values[5] === player() ) {
    return true;
  } else if ( values[6] === player() && values[7] === player() && values[8] === player() ){
    return true;
  } else if ( values[0] === player() && values[3] === player() && values[6] === player() ){
    return true;
  } else if ( values[1] === player() && values[4] === player() && values[7] === player() ){
    return true;
  } else if ( values[2] === player() && values[5] === player() && values[8] === player() ){
    return true;
  } else if ( values[0] === player() && values[4] === player() && values[8] === player() ){
    return true;
  } else if ( values[2] === player() && values[4] === player() && values[6] === player() ){
    return true;
  } else {
    return false;
  }
}

function cellValues(){
  var values = []
    $("td").each(function(i) {
      values.push($(this).html())
    })
  return values;
}


function checkWinner(){
  var values = cellValues();
  if ( matchValues(values) == true ) {
    var winMessage = "Player " + player() + " Won!"
    message(winMessage);
    return true;
  } else {
    return false;
  }
}

function player() {
  if(turn % 2 == 0) {
    return "X";
  }
  else {
    return "O";
  }
}

function checkTie(){
  var values = cellValues();
  if ( matchValues(values) == false && $.inArray("", values) == -1) {
    var tieMessage = "Tie game"
    message(tieMessage);
    return true;
  } else {
    return false;
  }
}

function doTurn(event){
  updateState(event);
  if(checkWinner() == true || checkTie() == true ) {
    save(true);
    resetGame();
  } else {
    turn += 1;
  }
}

function updateState(event){
  if ( $(event.target).html() === "" ) {
    $(event.target).html(player());
  }
}

function resetGame(){
  turn = 0;
  currentGame = 0;
  $('td').html("");
}

function message(message) {
  $("#message").html(message);
}

function attachListeners() {
  $("tbody").click(function(event) {
    doTurn(event);
  });
  $("#games").click(function(event) {
    var game = getGame(event)
    var id = getGameId(event)
    switchGame(game, id);
  })
  $("#save").click(function() {
    save();
  })
  $("#previous").click(function() {
    getAllGames();
  })
}

function getGame(event) {
  return $(event.target).data("state").split(",")
}

function getGameId(event) {
  return $(event.target).data("gameid")
}

function getAllGames() {
  $.get("/games").done(function(response) {
    showGames(response.games)
  })
}

function showGames(games) {
  var dom = $()
  games.forEach(function(game) {
    dom = dom.add(showGame(game));
  })
  $("#games").html(dom);
}

function showGame(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

function switchGame (game, id){
  currentGame = id;
  setGame(game);
  turn = setTurn;
}

function setTurn(state) {
  var turn = 0;
  state.forEach(function(item) {
    if(item != "") {
      turn += 1;
    }
  })
  return turn;
}

function setGame(game) {
  $("td").each(function(i) {
    $(this).text(game[i]);
  })
}

function getState() {
  var state = [];
  $("td").each(function(i) {
    state.push($(this).text())
  })
  return state;
}

function save(resetCurrentGame) {
  var url, method;
  var state = getState();
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
        state: state
      }
    }
  }).success(function(data) {
    if(resetCurrentGame) {
      currentGame = undefined;
    } else {
      currentGame = data.game.id;
    }
  });
}

$(function() {
  attachListeners()
})
