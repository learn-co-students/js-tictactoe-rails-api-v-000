// Code your JavaScript / jQuery solution here
const WIN_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
]

let currentState = ['','','','','','','','',''];
let turn = 0;

function player(){
  return turn % 2 ? "O" : "X";
}

function updateState(tile){
  tile.append(player())
}

function setMessage(message){
  $("#message").empty();
  $("#message").append(message);
}

function checkWinner(){
  $( "td" ).each(function( index ) {
    currentState[index] = $( this ).text();
  });

  let find_winner = !!WIN_COMBINATIONS.find(function(combo){
                      return currentState[combo[0]] === currentState[combo[1]] &&
                             currentState[combo[1]] === currentState[combo[2]] &&
                             currentState[combo[0]] !== ""});

  if (find_winner){
    setMessage(`Player ${player()} Won!`);
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
    saveGame();
    setMessage("Tie game.");
    clearBoard();
  }else{
    turn++;
  }
}

function saveGame(){
  $.post( "/games", { 'state[]': currentState } );
}

function previousGames(){
  $.get( "/games", function( json ) {
    let $games = $("div#games")
    $games.html("");
    json.data.forEach(function(game){
      $games.append(`<li>${game.id}</li>`)
    });
  });
}

function loadGame(gameId){
  $.get( `/games/${gameId}`, function( json ) {
    let index = 0;
    $("td").each(function (){
      this.innerHTML = json.data.attributes["state"][index];
      index++;
    })
  });
}

function clearBoard(){
  $("td").each(function (){
    this.innerHTML = ""
  })
  turn = 0;
  currentState = ['','','','','','','','',''];
}

function attachListeners(){
  $("#board").click(function (e) {
    if(e.target.innerHTML === ""){
      doTurn(e.target);
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
    loadGame(parseInt(e.target.innerHTML));
    e.preventDefault();
  });
}

$(function() {
  attachListeners();
});
