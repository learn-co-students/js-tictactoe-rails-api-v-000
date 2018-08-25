var squares = [] //need to declare? test seems to use.
var board = [];
var turnCount = 0;
const winCombos= [
  [012], [345], [678], //vertical
  [036], [147], [258], //horizontal
  [048], [246]  //diagonal
]

$(document).ready(function() {
  console.log("I am ready, sir.");
  attachListeners();
})

function attachListeners() {
  // listen for click on what?
  console.log("I am listening...");
}

function player() {
  if (turnCount % 2 === 0) {
    turnCount += 1;
    return "X";
  } else {
    turnCount += 1;
    return "O";
  }
}

function updateState(element) {
  $(element).text(player());
}

function setMessage(message_string) {
  $('#message').html(message_string);
}

// function checkWinner() {
//   //ideally:
//   //sample find portion of an array
//   // let found = arr1.some(r=> arr2.indexOf(r) >= 0)
//   let winState = gameState.some(f => winCombos.indexOf(r) >= 0);
//   if (winState == true) {
//     return true
//   }  else {
//     return false
//   }
// }

function checkWinner() {
  //some will return true or false
  var winner = false;
  // $('td').text((index, square) => board[index] = square);
  winCombos.forEach(function(combo) {
    if (board[combo[0]] === board[combo[1]] && board[combo[1]] == board[combo[2]] && board[combo[0]] !== ""){
      winner = true;
      return winner;
    } else {
      return winner = false;
    }
  });
  return winner;
}
