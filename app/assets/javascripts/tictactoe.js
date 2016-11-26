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
function Board(pos_1, pos_2, pos_3, pos_4, pos_5, pos_6, pos_7, pos_8, pos_9 ){
                this.pos_1 = pos_1;
                this.pos_2 = pos_2;
                this.pos_3 = pos_3;
                this.pos_4 = pos_4;
                this.pos_5 = pos_5;
                this.pos_6 = pos_6;
                this.pos_7 = pos_7;
                this.pos_8 = pos_8;
                this.pos_9 = pos_9;
}

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

function winStatus(winner, board){
  var e = 1;
  var f = 2;
  for(var j = 0; j < winCombos.length; j++){
     for(var k = 0; k < winCombos[j].length; k++,e++, f++){
            if (board[winCombos[j][k]] === "X" && board[winCombos[j][e]] === "X" && board[winCombos[j][f]] === "X"){
                 winner = "X";
                return winner;
        }
        else if(board[winCombos[j][k]] === "O" && board[winCombos[j][e]] === "O" && board[winCombos[j][f]] === "O"){
          winner = "O";
         return winner;
        }
        else{
          return false;
        }
     }

  }


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
