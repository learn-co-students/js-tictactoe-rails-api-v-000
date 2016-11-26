$(function () {
    attachListeners();
})

var turn = 0;
var winner ="";
var pos_1=  $("tr").children("td:td:nth(0)");
var pos_2=  $("tr").children("td:td:nth(1)");
var pos_3=  $("tr").children("td:td:nth(2)");
var pos_4=  $("tr").children("td:td:nth(3)");
var pos_5=  $("tr").children("td:td:nth(4)");
var pos_6=  $("tr").children("td:td:nth(5)");
var pos_7=  $("tr").children("td:td:nth(6)");
var pos_8=  $("tr").children("td:td:nth(7)");
var pos_9=  $("tr").children("td:td:nth(8)");

//  constructer function where each parameter is a position on the board
var board = [
              pos_1,
              pos_2,
              pos_3,
              pos_4,
              pos_5,
              pos_6,
              pos_7,
              pos_8,
              pos_9
            ]

var winCombos = [
              [0,1,2],
              [3,4,5],
              [6,7,8],
              [0,3,6],
              [1,4,7],
              [2,5,8],
              [0,4,8],
              [6,4,2]
]

function win(){
  var k = 0;
  var e = 1;
  var f = 2;
     for(var j = 0; j < winCombos.length; j++){
        if (board[winCombos[j][k]] === board[winCombos[j][e]] && board[winCombos[j][e]] === board[winCombos[j][f]] && board[winCombos[j][k]] !== "O"){
          winner = "X";
        }
        else if(board[winCombos[j][k]] === board[winCombos[j][e]] && board[winCombos[j][e]] === board[winCombos[j][f]] && board[winCombos[j][k]] !== "X"){
          winner = "O";
        }
        else{
          winner = false;
        }
     }
     return winner;
}

// ================================ MAIN FUNCTION ==================================
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
  // win(winner);
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
