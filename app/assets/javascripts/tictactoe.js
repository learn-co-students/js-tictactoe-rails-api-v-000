const WINNING_COMBOS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
    ]


// why does this have to be var to work?
var player = function() {
    if (turn % 2) {
        return "O"
    } else {
        return "X"
    }
} 


function updateState(square) {
   let token = player(); 
   $(square).text(token)
}


function checkWinner() {
// set variable that will hold the current state of the board
let board = {}
let counter = 0
let winner = false 
// convert square values to an array so that they can be compared to winCombinations 
  $('tr').each(function() {
    $(this).children('td').each(function(){
      board[counter] = $(this).html();
      counter++;
    })
  });
// check that each winning index combination is not empty AND contains the same value 

//return true if a winning combination is present else return false 
WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    } 
    
  });
return winner;
}




function setMessage(string) {  
    $('#message').append(string);
}


$(document).ready(function() {
    attachListeners();
  });

function attachListeners() {

}