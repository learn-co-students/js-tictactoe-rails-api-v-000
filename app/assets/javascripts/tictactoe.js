$(function() {
  attachListeners();
})

var turn = 0
// const winningCombos = {
//   [0, 1, 2], //top row
//   [3, 4, 5], //middle row
//   [6, 7, 8], //bottom row
//   [0, 3, 6], //column 1
//   [1, 4, 7], //column 2
//   [2, 5, 8], //column 3
//   [0, 4, 8], //diagonal 1
//   [2, 4, 6] //diagonal 2
// }


//GAME FUNCTIONALITY

function attachListeners() {
  $('td').on('click', function(e) {
    e.PreventDefault();
    doTurn(e)
  })
}

function doTurn(e) {
  turn += 1
  updateState(e)
  checkWinner()
}

function player() {
  // if (turn % 2 === 0) { //if no remainder then the turn is even
  //   return "X"; //return terminates the function, so the "O" return value will not get executed
  // }
  // return "O"; //returns "O" if the if statement was false 
  return (turn % 2 === 0) ? "X" : "O"
}

function updateState(e) { 
}

function checkWinner() {

}

function message() {

}
