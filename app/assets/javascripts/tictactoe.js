var turn = 0;
var WIN_COMBINATIONS = [
  [00, 10, 20],
  [01, 11, 21],
  [02, 12, 22],
  [00, 01, 02],
  [10, 11, 12],
  [20, 21, 22],
  [20, 11, 02],
  [00, 11, 22],
] ;

var xs = [];
var os = [];

var gameState = ["","","","","","","","",""];
var currentGameId = 0;

function attachListeners(){
  $('td').click(function(){
    var x = $(this).data("x");
    var y = $(this).data("y");
    if ($("[data-x='" + x + "'][data-y='" + y + "']")[0].innerText == ''){
      doTurn(x, y);
    }
  });
}

function doTurn(x, y){
  turn++;

  updateState(x, y);
  updatePlayerPositions(x, y);
  if(!checkWinner()){
      checkTie();
  }
}

function updatePlayerPositions(x, y) {
  if (player() == "O"){
    os.push(x.toString() + y);
  } else {
    xs.push(x.toString() + y);
  }
}

function updateState(x, y){
  index = getIndexFromCoords(x, y);
  gameState[index] = player();
 $("[data-x='" + x + "'][data-y='" + y + "']").html(player());
}

function checkWinner() {

  if(player() == "O"){
    played_tokens = os;
  } else {
    played_tokens = xs;
  }

  if (played_tokens.length >= 3) {
    WIN_COMBINATIONS.some(function(combo){

      winning_combo = [];
      combo.some(function(cell){

        played_tokens.some(function(token){
          if(token == cell){
            winning_combo.push(token);
          }
        }); //played_tokens

        if(winning_combo.length == 3){
          message('Player ' + player() + ' Won!');
          reset_board();
          return true;
        }

      }); //combo
    }); //WIN_COMBINATIONS
  } //if played_tokens
  return false;
}

function checkTie(){
  if(xs.length + os.length == 9){
    message('Tie game');
    reset_board();
  }
}

function message(string){
  $('#message').html(string);
}

function player(){
  if(turn % 2 == 0){
    return 'X';
  } else {
    return 'O';
  }
}

function reset_board() {
  gameState = ["","","","","","","","",""];
  turn = 0;
  currentGameId = 0;
  xs = [];
  os = [];
  $('td').html('');
}

function getAllGames(){
  $('#previous').click(function(){
    $.get('/games', function(response){
      console.log(response);
    });
  });
}

function saveGame(){
  $('#save').click(function(){
    if(currentGameId == 0){
      $.ajax({
        type: "POST",
        url: "/games",
        data: {game:{state: gameState}},
        success: function(response){
          currentGameId = response['id'];
          console.log(response['id']);
        }
      });
    } else {
      $.ajax({
        type: "PATCH",
        url: "/games/" + currentGameId,
        data: {game:{state: gameState, id: currentGameId}},
        success: function(response){
          currentGameId = response['id'];
          console.log(response['id']);
        }
      });
    }
  });
}

function getIndexFromCoords(x, y){
  var coords = x.toString() + y;
  var index = ['00', '10', '20', '01', '11', '21', '02', '12', '22'].indexOf(coords);
  return index;
}

$(document).ready(function(){
  attachListeners();
  getAllGames();
  saveGame();
});
