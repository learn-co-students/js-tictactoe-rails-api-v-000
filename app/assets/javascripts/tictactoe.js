$(function () {
    attachListeners();
})

var turn = 0;

var winner ="";

//  constructer function where each parameter is a position on the board
var Board = function(pos_1, pos_2, pos_3, pos_4, pos_5, pos_6, pos_7, pos_8, pos_9 ){
  var pos_1 = pos_1;
}


var winningCombinations={
                          [0,1,2],
                          [3,4,5],
                          [6,7,8],
                          [0,3,6],
                          [1,4,7],
                          [2,5,8],
                          [0,4,8],
                          [6,4,2]
}

winningCombinations.each do | win_combination |
        // # win_combination = [0,1,2], [3,4,5], [0,4,8], ... [2,4,6]

        win_index_1 = win_combination[0] // 0, 3
        win_index_2 = win_combination[1] // 1, 4
        win_index_3 = win_combination[2] // 2, 5

        position_1 = board[win_index_1] // "X", "O"
        position_2 = board[win_index_2] // "O", "X"
        position_3 = board[win_index_3] // "X", "O"

        if position_1 ==  position_2 && position_2 ==  position_3 && position_1 != " "
          return win_combination # return the win_combination indexes that won.
        else
          false
        end
      end



function attachListeners(){
  $("td").on('click', function(event) {
    doTurn(event);
  });
}

function doTurn(event){
  updateState(event);
  checkWinner();
  turn +=1
}

function player(){
  if (turn / 2 === 0){
    return "X";
  }else {
    return "O";
  }
}

function updateState(event){
  var value = player();
  $(event.target).html(value);
}

function checkWinner(){
  var response ="";
  if (winner==="X"){
    response = "Player X Won!"
  }else{
    response = "Player O Won!"
  }
  return message(response);
}

function message(response){
  $('#message').html(response);
}
