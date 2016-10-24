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

function attachListeners(){
  $('td').click(function(){
    var x = $(this).data("x");
    var y = $(this).data("y");

    doTurn(x, y);
  });
}

function doTurn(x, y){
  turn++;

  updateState(x, y);
  updatePlayerPositions(x, y);
  checkWinner();

  console.log('clicked ' + x + y);
  console.log('It is now turn ' + turn);
}

function updatePlayerPositions(x, y) {
  if (player() == "O"){
    os.push(x.toString() + y);
  } else {
    xs.push(x.toString() + y);
  }
}

function updateState(x, y){


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
          return true;
        }

      }); //combo
    }); //WIN_COMBINATIONS
  } //if played_tokens

  return false;
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

$(document).ready(function(){
  attachListeners();
});
