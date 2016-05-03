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
  checkTie(turn);
}

function message(string){
  $("#message").html(string);
}

function checkWinner(state){
  if(state === undefined){
    return false;
  }

  for(var i = 0; i < 8 ; i++){
    var a = state[WinningCombos[i][0]];
    var b = state[WinningCombos[i][1]];
    var c = state[WinningCombos[i][2]];

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
}

function checkTie(turn){
    if(turn === 9){
    message("Tie game");
    endGame = true;
    saveGame(endGame);
    reset();
  }
}

function player(){
  if (turn % 2 === 0){
    return "X";
  }else{
    return "O";
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

function reset(){
  currentGame = undefined;
  turn = 0;
  state = ["","","","","","","","",""];
  $("td").text("");
  endGame = false;
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

function getGames(gameData){
  $('#games').html("");
  $.get('/games', function(data){
    var games = data.games;
    for(var i = 0; i < games.length ;i++){
      game = games[i];
      $('#games').append("<a href ='#' data-gameid=" + game.id +">" + game.id + "</a>");
      $('[data-gameid=' + game.id + ']').on('click', function(){
        if(currentGame){
          updateGame();
        }else{
          saveGame(true);
        }
        reset();
        state = game.state;
        turn = state.filter(String).length;
        buildBoard(state);
      });
    }
  });
}

function buildBoard(state){

$('[data-x="0"][data-y="0"]').html(state[0]);
$('[data-x="1"][data-y="0"]').html(state[1]);
$('[data-x="2"][data-y="0"]').html(state[2]);
$('[data-x="0"][data-y="1"]').html(state[3]);
$('[data-x="1"][data-y="1"]').html(state[4]);
$('[data-x="2"][data-y="1"]').html(state[5]);
$('[data-x="0"][data-y="2"]').html(state[6]);
$('[data-x="1"][data-y="2"]').html(state[7]);
$('[data-x="2"][data-y="2"]').html(state[8]);
          
}

function attachListeners(){

  $('td').on('click', function(e){
    doTurn(e);
  });

  $("#previous").on('click', function(){
      getGames();
  });

  $("#save").on('click', function(){
    if(currentGame){
      updateGame();
    }else{
      saveGame(endGame);
    }
  });

}