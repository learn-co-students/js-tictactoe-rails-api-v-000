var turn = 0;
var token;
var currentGameState = new Array(9).fill("")
let currentGameId = 0
WIN_COMBINATIONS = [
  [0,1,2], [3,4,5], [6,7,8], [6,3,0], [7,4,1], [8,5,2], [0,4,8], [6,4,2]
  ]

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  $("td").on("click", function() {
    if (!checkWinner() && !$.text(this)) {
      doTurn(this);
    };
  });

  $("#previous").on("click", previousGames);
  $("#clear").on("click", resetBoard);
  $("#save").on("click", saveGame);

};

function previousGames() {
  $("#games").empty();
  $.get('/games', (game) => {
    game.data.forEach(function(game) {
      $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
      $(`#gameid-${game.id}`).on("click", () => loadGame(game.id));
    });
  });
};

function checkWinner(){
 let board = {}
 let winner = false;

 $('td').text(function(index, space) {
   board[index] = space;
 });

 WIN_COMBINATIONS.forEach(function(combo) {
  if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] != ""){
    setMessage("Player " + board[combo[0]] + " Won!")
    return winner = true;
    
 };
 });
 return winner;
};

function loadGame(id) {
  currentGameId = id
  $.get(`/games/${id}`, function(data){
    let board = data.data.attributes.state
    for(i=0; i < board.length; i++) {
      $('td')[i].innerHTML = board[i]
      turn = board.filter(String).length
    }
  })
}

function player() {
 
  if (turn % 2 === 0){
     let token = "X";
     return token;
  }
  else { 
    let token = "O";
    return token; 
};
};

function setMessage(message) {
 $('#message').append(message);
};

function updateState(state) {
  var token = player();
if ($(state).text() === "") {
  $(state).text(token);
};
};

function doTurn(token) {
  if (token.innerHTML === "") {
    updateState(token)
    
  }
  if (checkWinner()) {
    saveGame()
    resetBoard();
  } else if (turn === 8) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  } else{
    turn++;
  };
};

function saveGame(){
  gameData = {state: currentGameState}

  if (currentGameId){
    $.ajax({
      method: "PATCH",
      url: "/games/" + currentGameId,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(data){
      currentGameId = data["data"]["id"]
    });
  }
}

function resetBoard() {
  $("td").empty()
  turn = 0
  currentGameId = 0
}