const WIN_COMBINATIONS = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8],
                            [0,4,8], [6,4,2]]

var currentGame = 0;
var currentState = ['','','','','','','','',''];
var turn = 0;

$(function() {
  attachListeners();
});

function attachListeners(){
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });
  $("button#save").click(function(e){
    saveGame();
    e.preventDefault();
  });
  $("button#previous").click(function(e){
    previousGames();
    e.preventDefault();
  });
  $("button#clear").click(function(e){
    clearBoard();
    $("#message").empty();
    e.preventDefault();
  });
  $("div#games").click(function(e){
    currentGame = e.target.innerHTML
    loadGame();
    e.preventDefault();
  });
}

var player = () => turn % 2 ? "O" : "X";

function updateState(tile){
  tile.append(player())
}

function setMessage(message){
  $("#message").text(message);
}

function checkWinner(){
  let winner = false;
  $( "td" ).each(function( index ) {
    currentState[index] = $( this ).text();
  });

  winner = WIN_COMBINATIONS.find(function(combo){
                  return currentState[combo[0]] === currentState[combo[1]] &&
                        currentState[combo[1]] === currentState[combo[2]] &&
                        currentState[combo[0]] !== ""});

  if (winner){
    setMessage(`Player ${currentState[winner[0]]} Won!`);
    return true;
  }else{
    return false;
  }
}

function doTurn(tile){
  updateState(tile);
  if (checkWinner()){
    saveGame();
    clearBoard();
  }else if (!currentState.includes('')){
    setMessage("Tie game.");
    saveGame();
    clearBoard();
  }else{
    turn++;
  }
}

function saveGame(){
  if (currentGame === 0){
    $.post( "/games", { 'state[]': currentState }, function(json){
      currentGame = parseInt(json.data["id"]);
    });
  }else{
    $.ajax({
      type: "PATCH",
      url: `/games/${currentGame}`,
      data: { _method:'PUT', 'state[]': currentState },
      dataType: 'json'
    });
  }
}

function previousGames(){
  $.get( "/games", function( json ) {
    let $games = $("div#games")
    $games.html("");
    json.data.forEach(function(game){
      $games.append(`<button id="gameid-${game.id}">${game.id}</button><br>`)
    });
  });
}

function loadGame(){
  $.get( `/games/${currentGame}`, function( json ) {
    let index = 0;
    $("td").each(function (){
      this.innerHTML = json.data.attributes["state"][index];
      currentState[index] = [index];
      index++;
    })
    turn = json.data.attributes["state"].join('').length;
  });
}

function clearBoard(){
  $("td").each(function (){
    this.innerHTML = ""
  })
  turn = 0;
  currentState = ['','','','','','','','',''];
  currentGame = 0;
}
