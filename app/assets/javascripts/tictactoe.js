$(function() {
 attachListeners();
});

var turn = 0;
var state = ["","","","","","","","",""];
var WinningCombos = [[0, 1, 2], 
                     [3, 4, 5],
                     [6, 7, 8],
                     [0, 3, 6],
                     [1, 4, 7],
                     [2, 5, 8],
                     [0, 4, 8],
                     [2, 4, 6]];
var currentGame;
var endGame = false;


function doTurn(e){
  if($(e.target).html() !== "X" && $(e.target).html() !== "O"){
    updateState(e);
    turn += 1;
  }else{
    alert("Not a valid move");
  }
  checkWinner(state);
}

function attachListeners(){

  $('td').on('click', function(e){
    var x = $(e.target).data('x');
    var y = $(e.target).data('y');
    doTurn(e);
  });

  $("#previous").on('click', function(){
    $.get('/games', function(data){
      getGames(data);
    });
  });

  $("#save").on('click', function(){
    if(currentGame){
      updateGame();
    }else{
      saveGame(endGame);
    }
  });

}

function checkWinner(state){
  if(state === undefined){
    return false;
  }
  for(var i = 0; i < 8 ; i++){
    var a = state[WinningCombos[i][0]];
    var b = state[WinningCombos[i][1]];
    var c = state[WinningCombos[i][2]];
    // check state WinningCombos[i][0] [i][1] [i][2] if all three are o or x return o or x, other return no winner
    if(a !== "" && a === b & b === c){
      var win_message = "Player " + a + " Won!";
      message(win_message);
      endGame = true;
    }
  }

  if(endGame === true){
    saveGame(endGame);
    reset();
  }

  if(turn === 9){
    message("Tie game");
    endGame = true;
    saveGame(endGame);
    reset();
  }
}

function updateState(e){
  token = player();
  $(e.target).html(token);
  var x = $(e.target).data('x');
  var y = $(e.target).data('y');
  var i = y * 3 + x;
  state[i] = token;
}

function player(){
  if (turn % 2 === 0){
    token = "X";
  }else{
    token = "O";
  }
  return token;
}

function message(string){
  $("#message").html(string);
}

function reset(){
  currentGame = undefined;
  turn = 0;
  state = ["","","","","","","","",""];
  $("td").text("");
  endGame = false;
}

function getGames(gameData){
  $('#games').html("");
  var games = gameData.games;
  for(var i = 0; i < games.length ;i++){
    $('#games').append("<p>" + games[i].id + "</p>");
  }
}

function saveGame(endGame){
  $.post('/games', {state: state}).done(function(resp){
      if(endGame === false){
        currentGame = resp.game.id;
      }
    }
  );
}

function updateGame(){
  $.ajax({
        url: '/games/' + currentGame,
        type: 'PATCH'
  }).done(function(resp){
    });
}

