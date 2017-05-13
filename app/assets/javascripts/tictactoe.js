$(function() {
  attachListeners();
})

var turn = 0
const winningCombos = {
  [0, 1, 2], //top row
  [3, 4, 5], //middle row
  [6, 7, 8], //bottom row
  [0, 3, 6], //column 1
  [1, 4, 7], //column 2
  [2, 5, 8], //column 3
  [0, 4, 8], //diagonal 1
  [2, 4, 6] //diagonal 2
}


//GAME FUNCTIONALITY

var attachListeners = () => {
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
  return (turn % 2) ? "X" : "O"
}

function updateState(cell) {

}

function checkWinner() {

}

function message() {

}
