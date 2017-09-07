// Code your JavaScript / jQuery solution
// Game only saved when... saved. Or ended.
// Otherwise, it takes place entirely on the front-end
const WIN_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                    [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var game = 0;

function player(){
  if(turn % 2 === 0){return "X"}
  else{return "O"}
}

function updateState(square){
  $(square).text(player());
}

function doTurn(square){
    updateState(square);
    turn++;

  if(checkWinner()){
    saveGame();
    resetBoard();
  };
  if (turn === 9){
    message("Tie game.");
    saveGame();
    resetBoard();
  }
}

function checkWinner() {
  board = {};
  $('td').text((index,square) => board[index] = square);
  for (i = 0; i < WIN_COMBOS.length; i++){
    var combo = WIN_COMBOS[i];
    if (board[combo[0]] != "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]){
      message(`Player ${board[combo[0]]} Won!`);
      return true;
    }
  }
  return false;
}

function resetBoard() {
  $('td').text("");
  window.game = 0;
  window.turn = 0;
}

function message(string) {
  $('#message').text(string);
}

function saveGame(){
  state = []
  $('td').text((index, square) => {
  state.push(square);
});
  console.log(state)
  data = {state: state}
  if(window.game){
    $.ajax({
      method: 'PATCH',
      url: `/games/${game}`,
      data: data
    });
  }else{
    $.post('/games', data).done(function(resp){
      window.game = resp.data['id'];
    });
  }
}

function getGames(){
  $("#games").empty();
  $.get('/games', function(games){
    games.data.forEach(createButton)
  });
}

function createButton(game) {
  $("#games").append("<button onClick='loadGame("+game.id+")'> Game #"+ game.id +"</button> ")
}

function loadGame(gameId) {
  message('');
  $.get(`/games/${gameId}`, function(game){
    state = game.data.attributes["state"];
    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }
    window.game = gameId;
    window.turn = state.filter(function(val){
      return val != ""
    }).length;
  });
}


function attachListeners(){
  $("td").on('click', function(){
    if (!checkWinner() && !$.text(this))
    doTurn(this);
  });

  $("button#save").on('click', function(){
    saveGame();
  });

  $("button#previous").on('click', function(){
    getGames()
  });

  $("button#clear").on('click', function(){
    resetBoard();
    message("");
  });
}

$(function(){
  attachListeners();
});
