var turn = 0;
var current_game_id = 0;

const WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

$(document).ready(function(){
  attachListeners();
})

function attachListeners(){
  $('td').on('click', function(){
    if(!$.text(this) && !checkWinner()){
      doTurn(this);
    }
  })

  $('#save').on('click', function(){
    saveGame();
  })
  $('#previous').on('click', function(){
    showPreviousGames();
  })
  $('#clear').on('click', function(){
    reset();
  })
}


function checkWinner(){
 var board = {}
 $('td').text(function(index, value){
   board[index] = value;
 });

 var win = false;

 WIN_COMBINATIONS.some(function(combination){
   if(board[combination[0]] !== "" && board[combination[0]] === board[combination[1]] && board[combination[1]] === board[combination[2]]){
     message("Player " + board[combination[0]] + " Won!" );
     return win = true;
   }
 })
 return win;
}

function displayGameLink(game){
  $("#games").append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $("#gameid-" + game.id).on('click', function(){
    loadPreviousGame(game.id);
  });
}

function doTurn(square){
  updateState(square);
  turn++;

  var win = checkWinner();
  if(win){
    saveGame();
    reset();
  }else if (turn ===9){
    message("Tie game.");
    saveGame();
    reset();
  }
}

function loadPreviousGame(game_id){
  current_game_id = game_id;
  $.get("/games/" + game_id , function(data) {
    var game = data["data"]["attributes"];
    var index = 0;
    turn = game["state"].join("").length
    for(let y=0; y< 3; y++){
      for(let x=0; x<3; x++){
        $(`td[data-x="${x}"][data-y="${y}"]`).text(game["state"][index]);
        index++;
      }
    }
  });

}

function message(text){
  $("#message").text(text);
}

function player(){
  return turn % 2 ? 'O' : 'X';
}

function reset(){
  $('td').text("");
  message('');
  current_game_id = 0;
  turn = 0;
}

function saveGame(){
  var state = [];
  $('td').text(function(index, value){
    state.push(value);
  });

  var current_game = {state: state}
  if(current_game_id === 0){
    $.post('/games', current_game, function(saved_game){
      current_game_id = saved_game.data.id
      displayGameLink(saved_game.data)
    })
  }else{
    $.ajax({
      type: 'PATCH',
      url: `/games/${current_game_id}`,
      data: current_game
    });
  }
}

function showPreviousGames(){
  $('#games').text("");
  $.get('/games', function(data){
    var games = data["data"];
    games.forEach(displayGameLink);
  });
}

function updateState(square){
  $(square).text(player());
}
