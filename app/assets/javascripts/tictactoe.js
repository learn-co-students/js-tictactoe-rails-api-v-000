const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;

$(document).ready(function(){
  attachListeners();
});

function attachListeners(){
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => save());
  $('#previous').on('click', () => previous());
  $('#clear').on('click', () => clear());
}


function doTurn(td){
  if (turn == 0){message("");}
  updateState(td);
  turn += 1;
  if (checkWinner()){
    //save();
    //clear();
  }
  else if (turn == 9){
    message("Tie game.");
    //save();
    //clear();
  }
}

function updateState(td){
  $(td).text(player());
}

function save(){

}

function previous(){

}

function clear(){
  turn = 0;
  var nullArray = new Array(9);
  board(nullArray.fill(""),1);
  message("game reset!");
}

//update = 1 : 0
//1 means update the board with given array
//0 means scrape the board and get the current state in Array
function board(stateArray, update){
  $("td").each(function(index){
    update == 1 ?  $(this).text(stateArray[index]) : stateArray.push($(this).text());
  });
  return stateArray;
}

function player(){
  return turn % 2 == 0 ? "X" : "O";
}

function message(str){
  $('#message').text(str);
}

function checkWinner(){
  current_board = board([],0);
  let result = false;
  WINNING_COMBOS.forEach(function(win_combo){
    if (current_board[win_combo[0]] == current_board[win_combo[1]] && current_board[win_combo[0]] == current_board[win_combo[2]] && current_board[win_combo[0]] != ""){
      message(`Player ${current_board[win_combo[0]]} Won!`);
      result = true;
    }
  });
  return result;
}
