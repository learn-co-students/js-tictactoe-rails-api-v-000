$(attachListeners);

var turn = 0;
var currentGame = 0;
var board = [];
var WINNING_COMBOS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

function player(){
 return turn % 2 ? "O" : "X";
}


function updateState(td){
  td.innerHTML = player();
}


function setMessage(message){
  $('#message').html(message);
}

function boardArrFromTd(){
  $('td').text((index,td)=>(board[index] = td));
}

function checkWinner(){
  var winner = false;
  boardArrFromTd();
  WINNING_COMBOS.forEach(function(combo){
    if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== ''){
      winner = true;
      if (winner){
        setMessage(`Player ${board[combo[0]]} Won!`);
      }
    }
  })
  return winner;
}


function doTurn(td){
  updateState(td);
  turn ++;
  if (checkWinner()){
    clearGame();
    saveGame();
  } else if (turn === 9 ){
    setMessage("Tie game.");
    saveGame();
    clearGame();
  }
}
  

function attachListeners(){
  $('td').on('click', function(){
    if (!this.innerHTML && !checkWinner()){
    doTurn(this);
    }
  });
  $('#save').click(() => saveGame());
  $('#previous').click(() => previousGames());
  $('#clear').click(() => clearGame());
}


function saveGame(){
  boardArrFromTd();
  var game_data = { state: board }
  if (currentGame){
    $.ajax({
      type: "PATCH",
      url: `/games/${currentGame}`,
      data: game_data
    });
  } else {
    $.post("/games", game_data).done(function(res){
      currentGame = res.data.id;
    });
  };
}


function previousGames(){
  $("#games").html("");
  $.getJSON('/games', function(games){
    games.data.map(function(game){
      $("#games").append(`<button id="gameId-${game.id}">${game.id}</button>`);
      $(`#gameId-${game.id}`).click(function(){ getSavedGame(game.id);})
    });
 });
}


function clearGame(){
  $('td').empty();
  turn = 0;
  currentGame = 0;
}


function getSavedGame(gameId){
  $.get(`/games/${gameId}`, function(game){
    var state = game.data.attributes.state;
    $("td").text((i, text) => state[i]);
    currentGame = gameId;
    turn = state.join("").length;
    checkWinner();
  });
 }