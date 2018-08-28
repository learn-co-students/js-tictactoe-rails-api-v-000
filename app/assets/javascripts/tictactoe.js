// Code your JavaScript / jQuery solution here
var turn = 0;
const WINNING_COMBINATIONS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]

function player(){
  if (turn % 2 === 0 || turn === 0){ 
    return "X";
  } else {
    return "O";
  }
}

function updateState(cell){
  $(cell).text(player());
}

function setMessage(message){
  $("#message").html(message)  
}

function checkWinner() {
  // const WINNING_COMBINATIONS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    var board = getBoard();
    WINNING_COMBINATIONS.some(function (combo){

      if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]){
        return winner = true;
      }
      else { 
        return winner = false;
      }
      debugger;
    })
}

function getBoard(){
  return $("td").toArray().map((element) => {return element.innerHTML})
}